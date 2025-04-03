import express, { query } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import axios from "axios";

const typeDefs = `
    type User{
    id: ID!
    name: String!
    email: String!
    phone: String!
    }

    type Todo{
    id: ID!
    title: String,
    completed: Boolean
    user: User
    userId: ID!
    }

    type Query{
    getTodos: [Todo]
    getAllUsers: [User]
    getUser(id: ID!): User
    }
`

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Todo: {
        user: async (toDo)=>  (await axios.get(`https://jsonplaceholder.typicode.com/users/${toDo.userId}`)).data,
      },
        Query: {
            getTodos: async ()=> (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
            getAllUsers: async ()=> (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
            getUser: async (parent, {id})=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
        }
    }
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }))

  app.use(cors());
  
  await server.start();
  
  app.use("/graphql", expressMiddleware(server, {context: async({req})=> ({})}));
  

  app.listen(3000, () => console.log("server running on port 3000"));
}

startServer()
