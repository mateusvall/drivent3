import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import {  getHotelsByUser, getRoomsByHotel } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotelsByUser)
  .get("/:hotelId", getRoomsByHotel);

export { hotelsRouter };
