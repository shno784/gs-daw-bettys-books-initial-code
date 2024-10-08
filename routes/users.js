// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post("/registered", function (req, res, next) {
  // saving data in database
  const saltRounds = 10;
  const plainPassword = req.body.password;

  //Store hashed password in database
  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    let sqlquery =
      "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
    // execute sql query
    let newuser = [
      req.body.username,
      req.body.first,
      req.body.last,
      req.body.email,
      hashedPassword,
    ];
    db.query(sqlquery, newuser, (err, result) => {
      if (err) {
        next(err);
      } else
        result =
          "Hello " +
          req.body.first +
          " " +
          req.body.last +
          " you are now registered!  We will send an email to you at " +
          req.body.email;
      result +=
        "Your password is: " +
        req.body.password +
        " and your hashed password is: " +
        hashedPassword;

      res.send(result);
    });
  });
});

router.get("/list", function (req, res, next) {
  let sqlquery = "SELECT * FROM users";
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("userlist.ejs", { users: result });
  });
});

router.get("/login", function (req, res, next) {
  res.render("login.ejs");
});

router.post("/loggedin", function (req, res, next) {
  let sqlquery = "SELECT hashedpassword from users where username=(?)";
  const name = req.body.username;
  db.query(sqlquery, name, (err, result) => {
    if (err) {
      next(err);
    }
    if (result.length === 0) {
      res.send("Incorrect username");
    } else {
      const hashedPassword = result[0].hashedpassword;
      bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
        if (err) {
          next(err);
        } else if (result == true) {
          // TODO: Send message
          res.send("Sucessfully logged in " + name);
        } else {
          // TODO: Send message
          res.send("Incorrect Password");
        }
      });
    }
  });
});

// Export the router object so index.js can access it
module.exports = router;
