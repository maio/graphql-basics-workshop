const graphql = require('graphql');
const storage = require('../storage/storage.js');

const {
  GraphQLSchema,
  GraphQLObjectType
} = graphql;

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // ...
  }
});

module.exports = new GraphQLSchema({
  query: Query
});
