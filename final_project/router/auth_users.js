const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ id: 1, username: 'deni', password: 'test123' }];

const isValid = (username)=>{ //returns boolean
    return users.find(user => user.username === username && user.password === password);

}

const authenticatedUser = (username,password)=>{ //returns boolean
    let usersList = Object.values(users);
   let user = usersList.find(b => b.username==username)
  if (user) {
    // check if the provided password matches the password in our records
    if (users.password === password) {
      // username and password match, return true
      return true;
    }
  }
  // username and/or password do not match, return false
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide a valid username and password' });
    }
    const user = users.find(u => u.username === username && u.password === password);
  
    // Check if username and password match
    if (username === user.username && password === user.password) {
      const accessToken = jwt.sign({ username, userPassword: password }, "secretKey", { expiresIn: '1h' });
  
      // Store the access token in the session
      req.session.accessToken = accessToken;
  
      return res.status(200).json({ message: 'Login successful',accessToken });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review successfully posted");
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
