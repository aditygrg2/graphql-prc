const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("./config/mongoose");
const app = express();
const schema = require("./graphql/schema");
const resolver = require("./graphql/resolver");
const isauth = require("./middleware/isauth");

const events = [];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Awesome link to understand prototypes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

app.use(bodyParser.json());

// Query is similar to GET, Mutations is similar to POST in REST world
// OrderDate is kept as String, but we will parse into Date when sending to DB

// I made password not nullable here, because see, the things here are to be sent from the backend to the frontend.
// and we do not want to send password, so on API level, it should say that okay we are okay for being password as null.

// Why isauth as a middleware? GraphQL does not have different routes to like enter middleware in specific routes.
// 1. This is the reason why we are just setting a property not throwing an error, because this way we can access the properties in request and check things in our controllers to give user access or not.
// 2. At the top, because I want that this appears in all requests.
app.use(isauth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
  })
);

// This is pretty awesome now. I can pass query events, and any values inside it, it just returns what was requested.

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("Running on port 8000");
});
