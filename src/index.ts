import "module-alias/register";
require("dotenv").config();
require("source-map-support").install();

import * as express from "express";
import { Request, NextFunction, Response } from "express";
import * as throng from "throng";
import prodLogger from "./logger/prodLogger";
import Sentry from "./sentry";
import { ApolloServer, gql } from "apollo-server-express";

function isProd() {
  return process.env.NODE_ENV === "production";
}

const WORKERS = process.env.WEB_CONCURRENCY || 1;

if (isProd()) {
  throng(
    {
      workers: WORKERS,
      lifetime: Infinity,
    } as any,
    start,
  );
} else {
  start();
}

const sentryLogMddleware = async (
  resolve: any,
  root: any,
  args: any,
  context: any,
  info: any,
) => {
  Sentry.configureScope((scope) => {
    if (context.user) {
      scope.setUser(context.user);
    }
  });
  try {
    const result = await resolve(root, args, context, info);
    return result;
  } catch (e) {
    if (!isProd()) {
      // throw error if development
      throw e;
    }
    throw e;
  }
};

function start() {
  // A schema is a collection of type definitions (hence "typeDefs")
  // that together define the "shape" of queries that are executed against
  // your data.
  const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in our data source.
    type Book {
      title: String
      author: String
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
      books: [Book]
    }
  `;
  const books = [
    {
      title: "Harry Potter and the Chamber of Secrets",
      author: "J.K. Rowling",
    },
    {
      title: "Jurassic Park",
      author: "Michael Crichton",
    },
  ];
  // Resolvers define the technique for fetching the types defined in the
  // schema. This resolver retrieves books from the "books" array above.
  const resolvers = {
    Query: {
      books: () => books,
    },
  };

  const app = express();
  const path = "/graphql";

  const server = new ApolloServer({ typeDefs, resolvers });

  // CORS
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });

  server.applyMiddleware({ app, path });

  app.listen({ port: 4000 }, () =>
    console.log(
      `🚀 Server Playground ready at http://localhost:4000${server.graphqlPath}`,
    ),
  );
}
