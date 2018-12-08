const _ = require('lodash');
const fetch = require('node-fetch');

const books = [
  { id: '1', name: 'The Color of Magic', isbn: '9780060855925', authorId: '1' },
  { id: '2', name: 'Mort', isbn: '9780552140157', authorId: '1' },
  { id: '3', name: 'The Hobbit', isbn: '9780547898711', authorId: '2' },
  { id: '4', name: 'The Lord of the Rings', isbn: '9780618260249', authorId: '2' }
];

const authors = [
  { id: '1', name: 'Terry Pratchett' },
  { id: '2', name: 'J.R.R. Tolkien' }
];

var seqn = 4;

// -- Books
function insertBook({ name, authorId, isbn }) {
  const book = {
    id: `${++seqn}`,
    name,
    authorId,
    isbn
  };

  books.push(book);

  return book;
}

function getAllBooks () {
  return books;
}

function getBookById (id) {
  return _.find(books, { id });
}

function getBooksByAuthorId (authorId) {
  return _.filter(books, { authorId });
}

function getBookThumbnailByIsbn(isbn) {
  if (!isbn) {
    return null;
  }

  const key = `ISBN:${isbn}`;

  return fetch(`http://openlibrary.org/api/books?bibkeys=${key}&format=json`)
    .then(r => r.json())
    .then(data => {
      const url = data[key].thumbnail_url;
      return url && url.replace('-S.', '-L.');
    });
}

// -- Authors
function insertAuthor({ name }) {
  const author = {
    id: `${++seqn}`,
    name
  };

  authors.push(author);

  return author;
}

function getAllAuthors () {
  return authors;
}

function getAuthorById (id) {
  return _.find(authors, { id });
}

module.exports = {
  // -- Books
  insertBook,
  getAllBooks,
  getBookById,
  getBooksByAuthorId,
  getBookThumbnailByIsbn,
  // -- Authors
  insertAuthor,
  getAllAuthors,
  getAuthorById
};
