import express, { query } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import axios from "axios";

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs:`
    type Todo{
    id: ID!
    title: String,
    completed: Boolean
    }

    type Query{
    getTodos: [Todo]
    }
    `,
    resolvers: {
        Query: {
            getTodos: async ()=> (await axios.get("https://jsonplaceholder.typicode.com/todos")).data
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
