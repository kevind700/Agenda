const {
    makeExecutableSchema,
    mergeSchemas
} = require('graphql-tools');
const fs = require('fs');
const {
    MongoClient,
    ObjectId
} = require('mongodb');
const typeDefs1 = fs.readFileSync(__dirname + '/user.graphql').toString();
const typeDefs2 = fs.readFileSync(__dirname + '/contact.graphql').toString();
const typeDefs = typeDefs1 + typeDefs2;

class User {
    constructor(client) {
        this.collection = client.collection('user');
    }

    getSchema() {
        const resolvers = {
            Query: {
                allUser: async (root, args) => {
                        const res = await this.collection.find().toArray();
                        for (var i = 0; i < res.length; i++) {
                            var obj = res[i];
                            for (var prop in obj) {
                                if (prop == "_id") {
                                    obj[prop] = obj[prop].toString();
                                }
                            }
                        }
                        return res;
                    },
                    currentUser: (root, args) => {
                        return {
                            _id: '1',
                            name: 'kevin',
                            password: '123456',
                            role: 'ADMIN',
                            contact: [{
                                    _id: '2',
                                    name: 'Kevin',
                                    lastName: 'Ariza',
                                    phone: '3008168283',
                                    email: 'kevind199505@gmail.com',
                                },
                                {
                                    _id: '2',
                                    name: 'Kevin',
                                    lastName: 'Ariza',
                                    phone: '3008168283',
                                    email: 'kevind199505@gmail.com'
                                }
                            ]
                        }
                    }
            },
            Mutation: {
                createUser: async (root, args) => {
                        const res = await this.collection.insertOne(args);
                        const user = await this.collection.findOne({
                            _id: new ObjectId(res.insertedId)
                        });
                        return {
                            ...user,
                            _id: user._id.toString()
                        }
                    },
                    deleteAllUser: async (root, args) => {
                        await this.collection.remove({});
                        return {
                            code: 400,
                            message: "Usuarios eliminados correctamente"
                        };
                    }
            }
        };

        return makeExecutableSchema({
            typeDefs,
            resolvers
        });
    }
}


module.exports.User = User;