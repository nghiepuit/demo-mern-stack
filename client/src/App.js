import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "./App.css";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logout } from "./actions/authAction";

if (localStorage.JWT_TOKEN) {
  setAuthToken(localStorage.JWT_TOKEN);
  const decoded = jwt_decode(localStorage.JWT_TOKEN);
  store.dispatch(setCurrentUser(decoded));
  // check token exp
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logout());
    // TODO : Clear current profile
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="wrapper">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
