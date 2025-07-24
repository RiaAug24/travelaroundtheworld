import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { city, userType } from "../../../types/types";
import { Context } from "@apollo/client";

const typeDefs = `
  type City {
    id: ID!
    cityName: String!
    country: String!
    emoji: String
    date: String
    notes: String
    latitude: Float
    longitude: Float
    userId: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    getAllCities: [City!]!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, avatar: String): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    createCity(
      cityName: String!
      country: String!
      emoji: String
      date: String
      notes: String
      latitude: Float!
      longitude: Float!
    ): City!
    deleteCity(id: ID!): City!
  }
`;

const resolvers = {
  Query: {
    getAllCities: async () => {
      try {
        const cities = await prisma.city.findMany({});
        return cities;
      } catch {
        throw new Error("Failed to fetch cities");
      }
    },
  },

  Mutation: {
    register: async (
      _: any,
      { username, email, password, avatar }: userType
    ) => {
      const hashedPassword = bcrypt.hashSync(password as string);

      try {
        const userExists = await prisma.user.findUnique({
          where: { username },
        });
        let user;
        if (!userExists) {
          user = await prisma.user.create({
            data: {
              username,
              email,
              password: hashedPassword,
              avatar,
            },
          });
        } else {
          user = userExists;
        }
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "24h" }
        );

        return { token };
      } catch (error) {
        console.log(error);
        throw new Error("Registration failed");
      }
    },

    login: async (_: any, { username, password }: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const passwordValid = bcrypt.compareSync(password, user.password);
        if (!passwordValid) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "24h" }
        );

        return { token };
      } catch (error) {
        console.log(error);
        throw new Error("Login failed");
      }
    },

    createCity: async (
      _: any,
      { cityName, country, emoji, date, notes, latitude, longitude }: city,
      context: Context
    ) => {
      if (!context.userId) {
        throw new Error("Authentication required");
      }

      try {
        const city = await prisma.city.create({
          data: {
            cityName,
            country,
            emoji,
            date: new Date(date as Date),
            notes,
            latitude,
            longitude,
            userId: context.userId,
          },
        });

        return city;
      } catch (error) {
        throw new Error("Failed to create city");
      }
    },

    deleteCity: async (_: any, { id }: any, context: Context) => {
      if (!context.userId) {
        throw new Error("Authentication required");
      }

      try {
        // Find the city first
        const city = await prisma.city.findUnique({ where: { id } });
        if (!city || city.userId !== context.userId) {
          throw new Error("City not found or unauthorized");
        }

        // Delete by id only
        const deletedCity = await prisma.city.delete({ where: { id } });
        return deletedCity;
      } catch (error) {
        throw new Error("Failed to delete city");
      }
    },
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8383 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (token) {
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
          ) as { id: string };
          return { userId: decoded.id };
        } catch (error) {
          return {};
        }
      }

      return {};
    },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
