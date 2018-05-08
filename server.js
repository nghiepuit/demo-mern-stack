const express = require("express");
const mongoose = require("mongoose");
const mongoURI = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongodb connected!"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello express!"));
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
