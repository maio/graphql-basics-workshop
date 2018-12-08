const graphql = require('graphql');
const storage = require('../storage/storage.js');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} = graphql;

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    isbn: {
      type: GraphQLString,
      description: 'ISBN-13 - International Standard Book Number (e.g., 9780060855925)'
    },
    author: {
      type: new GraphQLNonNull(AuthorType),
      resolve (book, args) {
        return storage.getAuthorById(book.authorId);
      }
    },
    thumbnailUrl: {
      type: GraphQLString,
      description: 'Link to book thumbnail',
      resolve (book, args) {
        return storage.getBookThumbnailByIsbn(book.isbn);
      }
    },
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    books: {
      type: new GraphQLList(BookType),
      resolve (author, args) {
        return storage.getBooksByAuthorId(author.id);
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    books: {
      type: new GraphQLList(BookType),
      description: 'Get list of all books',
      resolve (parent, args) {
        return storage.getAllBooks();
      }
    },
    book: {
      type: BookType,
      description: 'Fetch book by ID',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve (parent, args) {
        return storage.getBookById(args.id);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'Get list of all authors',
      resolve (parent, args) {
        return storage.getAllAuthors();
      }
    },
    author: {
      type: AuthorType,
      description: 'Fetch author by ID',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve (parent, args) {
        return storage.getAuthorById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        authorId: { type: GraphQLID },
        isbn: { type: GraphQLString }
      },
      resolve (parent, { name, authorId, isbn }) {
        return storage.insertBook({ name, authorId, isbn });
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString }
      },
      resolve (parent, { name }) {
        return storage.insertAuthor({ name });
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
