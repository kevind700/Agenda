const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');
const {
    ApolloServer,
    gql
} = require('apollo-server');

const {
    User
} = require('./models/User.js');

const url = 'mongodb://localhost:27017';
const dbName = 'agenda';
MongoClient.connect(url, {
    useNewUrlParser: true
}, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    const userController = new User(db)

    const server = new ApolloServer({
        schema: userController.getSchema()
    });

    server.listen().then(({
        url
    }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
});