const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(409).json({message: 'Username already exists'});
    }
  
    // Add the new user to the users array
    users.push({username, password});
  
    // Return a success message
    return res.status(200).json({message: 'User registered successfully'});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN])
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.author===author);
   
      if (book) {
       let bookDetails = JSON.stringify(book);
       res.send(bookDetails);
     } else {
       res.send(`No book found for author ${author}`);}
   });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksList=Object.values(books)
    let book = booksList.find(b => b.title===title);
   
      if (book) {
       let bookDetails = JSON.stringify(book);
       res.send(bookDetails);
     } else {
       res.send(`No book found for title ${title}`);}
   });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
  });


function getBookList(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }
  
  // Get the book list available in the shop
  public_users.get('/',function (req, res) {
    getBookList().then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    );  
  });
  
  function getFromISBN(isbn){
    let book_ = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book_) {
        resolve(book_);
      }else{
        reject("Unable to find book!");
      }    
    })
  }
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send(error)
    )
   });

  function getFromAuthor(author){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_ = books[isbn];
        if (book_.author === author){
          output.push(book_);
        }
      }
      resolve(output);  
    })
  }
  
  // Get book details based on author
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });

  function getFromTitle(title){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_ = books[isbn];
        if (book_.title === title){
          output.push(book_);
        }
      }
      resolve(output);  
    })
  }
  
  // Get all books based on title
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });
  

module.exports.general = public_users;
