import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { city, userType } from "../../../types/types";

interface ServerContext {
  userId?: string;
}

const typeDefs = `
  type City {
    id: ID!
    cityName: String!
    country: String!
    emoji: String
    date: String
    notes: String
    latitude: Float!
    longitude: Float!
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
    getAllCities: async (_: any, __: any, context: ServerContext) => {
      console.log("Fetching all cities for user:", context.userId);
      
      try {
        const cities = await prisma.city.findMany({
          where: context.userId ? { userId: context.userId } : {},
          orderBy: { date: 'desc' }
        });
        console.log("Fetched cities:", cities.length);
        return cities;
      } catch (error) {
        console.error("Error fetching cities:", error);
        throw new Error("Failed to fetch cities");
      }
    },
  },

  Mutation: {
    register: async (_: any, { username, email, password }: userType) => {
      const hashedPassword = bcrypt.hashSync(password as string);

      try {
        const userExists = await prisma.user.findUnique({
          where: { username },
        });
        
        if (userExists) {
          throw new Error("Username already exists!");
        }

        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "24h" }
        );

        return { token };
      } catch (error) {
        console.error("Registration error:", error);
        throw new Error(error.message || "Registration failed");
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
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "24h" }
        );

        return { token };
      } catch (error) {
        console.error("Login error:", error);
        throw new Error(error.message || "Login failed");
      }
    },

    createCity: async (
      _: any,
      { cityName, country, emoji, date, notes, latitude, longitude }: city,
      context: ServerContext
    ) => {
      console.log("=== CREATE CITY RESOLVER ===");
      console.log("Context userId:", context.userId);
      console.log("Input data:", { cityName, country, emoji, date, notes, latitude, longitude });
      
      if (!context.userId) {
        throw new Error("Authentication required");
      }

      try {
        // Validate required fields
        if (!cityName || !country || latitude === undefined || longitude === undefined) {
          throw new Error("Missing required fields: cityName, country, latitude, longitude");
        }

        // Prepare city data with proper types
        const cityData = {
          cityName: cityName.trim(),
          country: country.trim(),
          emoji: emoji || "🏙️",
          date: date ? new Date(date) : new Date(),
          notes: notes && notes.trim() ? notes.trim() : null,
          latitude: parseFloat(latitude.toString()),
          longitude: parseFloat(longitude.toString()),
          userId: context.userId,
        };

        console.log("Prepared city data:", cityData);
        console.log("Date object:", cityData.date);
        console.log("Date ISO string:", cityData.date.toISOString());

        const newCity = await prisma.city.create({
          data: cityData,
        });

        console.log("City created successfully:", newCity);
        return newCity;
      } catch (error) {
        console.error("Error creating city:", error);
        console.error("Error details:", error.message);
        throw new Error(`Failed to create city: ${error.message}`);
      }
    },

    deleteCity: async (_: any, { id }: any, context: ServerContext) => {
      console.log("=== DELETE CITY RESOLVER ===");
      console.log("Context userId:", context.userId);
      console.log("City ID to delete:", id);
      
      if (!context.userId) {
        throw new Error("Authentication required");
      }

      try {
        // Find the city first to verify ownership
        const existingCity = await prisma.city.findUnique({ 
          where: { id } 
        });
        
        if (!existingCity) {
          throw new Error("City not found");
        }
        
        if (existingCity.userId !== context.userId) {
          throw new Error("Unauthorized: You can only delete your own cities");
        }

        // Delete the city
        const deletedCity = await prisma.city.delete({ 
          where: { id } 
        });
        
        console.log("City deleted successfully:", deletedCity);
        return deletedCity;
      } catch (error) {
        console.error("Error deleting city:", error);
        throw new Error(`Failed to delete city: ${error.message}`);
      }
    },
  },
};

const server = new ApolloServer<ServerContext>({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8383 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      console.log("Authorization token:", token ? "Present" : "Not present");

      if (token) {
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
          ) as { id: string };
          console.log("Decoded user ID:", decoded.id);
          return { userId: decoded.id };
        } catch (error) {
          console.error("JWT verification failed:", error);
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