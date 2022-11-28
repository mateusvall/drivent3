import app, { init } from "@/app";
import httpStatus from "http-status";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotelWithRooms, createTicket, createTicketType, createUser } from "../factories";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 204 when there is no enrollment for given user", async () => {
      const token = await generateValidToken();
      
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should respond with status 200 and a list with all hotels", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotelWithRooms();
      
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveLength(1);
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 204 when there is no enrollment for given user", async () => {
      const token = await generateValidToken();
      
      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should respond with status 200 and a list with all rooms", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const token = await generateValidToken(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotelWithRooms = await createHotelWithRooms();
      
      const response = await server.get(`/hotels/${hotelWithRooms.id}`).set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: hotelWithRooms.id,
          name: hotelWithRooms.name,
          image: hotelWithRooms.image,
          createdAt: hotelWithRooms.createdAt.toISOString(),
          updatedAt: hotelWithRooms.updatedAt.toISOString(),
          Rooms: [
            {
              id: hotelWithRooms.Rooms[0].id,
              name: hotelWithRooms.Rooms[0].name,
              capacity: hotelWithRooms.Rooms[0].capacity,
              hotelId: hotelWithRooms.Rooms[0].hotelId,
              createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
              updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
            }
          ]
        })
      );
    });
  });
});
