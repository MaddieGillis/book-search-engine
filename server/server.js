const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const path = require('path');
const { typeDefs, resolvers } = require("./schemas");
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');


const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your-database-name');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

server.applyMiddleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(express.static('public'));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/'));
// });


async function startApolloServer(typeDefs, resolvers) {
  await server.start();
  server.applyMiddleware({ app });
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`)
  });
  
}
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build'));
});

startApolloServer(typeDefs, resolvers);




