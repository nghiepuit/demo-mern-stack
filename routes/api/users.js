const express = require("express");
const router = express.Router();
const User = require("./../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./../../config/keys");
const passport = require("passport");
const validateRegisterInput = require("./../../validation/register");
const validateLoginInput = require("./../../validation/login");

router.get("/", (req, res) => {
  res.json({ msg: "User workds" });
});

/* 
  @route : GET api/users/register
  @desc : Register user
  @access : public
*/
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: req.body.avatar,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

/* 
  @route : GET api/users/login
  @desc : Login
  @access : public
*/
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    User.findOne({ email }).then(user => {
      if (!user) {
        errors.email = "User email not foun";
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        } else {
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              return res.json({
                success: true,
                token: `Bearer ${token}`
              });
            }
          );
        }
      });
    });
  }
});

/* 
  @route : GET api/users/current
  @desc : Get current user
  @access : private
*/
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req.user);
    res.json({
      id: req.user.id,
      name: req.user.name,
      avatar: req.user.avatar,
      email: req.user.email
    });
  }
);

module.exports = router;
