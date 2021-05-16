"use strict";

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userInfo = require("../BackEnd/models/userModel");

let options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = "jwtSecret";

const initializePassport = () => {
  passport.use(
    new JwtStrategy(options, (decodedPayload, callback) => {
      console.log(decodedPayload);
      const userId = decodedPayload.data;
      userInfo.findById(
        userId,
        (error, user) => {
          console.log(userId);
          if (error) {
            return callback(error, false);
          } else if (user) {
            callback(null, user);
          } else {
            callback(null, false);
          }
        }
      );
    })
  );
};

const requireSignIn = (req, res, next) => {
    //console.log(req);
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    console.log(error)
    console.log(user);
    if (error || !user) {
      const error = {
        errorMessage: "Please login to continue",
      };
      return res.status(401).json(error);
    } else {
      req.user = user;
    }
    return next();
  })(req, res, next);
};

module.exports = {
  initializePassport,
  requireSignIn,
};
