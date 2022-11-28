import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotelsByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try{
    const hotels = await hotelsService.getHotelsByUserId(userId);

    return res.status(httpStatus.OK).send(hotels);
  }catch(error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getRoomsByHotel(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);
  try{
    const rooms = await hotelsService.getRoomsByHotelId(hotelId);

    return res.status(httpStatus.OK).send(rooms);
  }catch(error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

