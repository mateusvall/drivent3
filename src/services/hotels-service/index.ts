import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotelsByUserId(userId: number) {
  const enrollment = await hotelsRepository.findEnrollmentByUserId(userId);
  if(!enrollment) throw notFoundError();

  // const ticketTypeId = enrollment.Ticket[0].ticketTypeId;
  // if(!ticketTypeId) throw notFoundError();

  // const paidTicket = await hotelsRepository.findPaidTicket(ticketTypeId);
  // if(!paidTicket) throw notFoundError();

  const hotels = await hotelsRepository.findManyHotels();
  return(hotels);
}

async function getRoomsByHotelId(hotelId: number) {
  const rooms = await hotelsRepository.findManyRooms(hotelId);
  if(!rooms) throw notFoundError();
  return(rooms);
}

const hotelsService = {
  getHotelsByUserId,
  getRoomsByHotelId
};

export default hotelsService;
