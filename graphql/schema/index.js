const {buildSchema} = require('graphql');

module.exports = buildSchema(`        
type Product{
    title: String!
    description: String!
    price: Float!
    user_id: String!
}

enum StatusType {
    PLACED
    STARTED
    PREPARED
    COMPLETED
}

type Order{
    _id: ID!,
    products: [Product!]!,
    orderDate: String,
    status: StatusType,
    ordererName: String!,
}

type User{
    _id: ID!,
    email: String!,
    password: String,
    businessName: String
}

type AuthData{
    userId: ID!,
    token: String!,
    tokenExpiration: Int!
}

input ProductInput {
    title: String!,
    description: String!,
    price: Float!,
    user_id: String!
    _id: ID,
}

input UserInput {
    email: String!,
    password: String!,
    businessName: String
}

input OrderInput {
    ordererName: String!
    products: [ProductInput!]!
    orderDate: String
    status: StatusType
}

type RootQuery {
    products(user_id: String!): [Product!]!
    order: Order
    login(email: String!, password:String!): AuthData
}

type RootMutation{
    createProduct(productInput: ProductInput): Product
    createUser(userInput: UserInput): User
    createOrder(orderInput: OrderInput): Order
    getOrder(userId: String): Order
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)