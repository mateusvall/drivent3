import { prisma } from "@/config";

async function findEnrollmentByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: {
      userId: userId
    },
    include: {
      Ticket: true
    }
  });
}

async function findPaidTicket(ticketTypeId: number) {
  return prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
      isRemote: false,
      includesHotel: true
    }
  });
}

async function findManyHotels() {
  return prisma.hotel.findMany();
}

async function findManyRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    },
    include: {
      Rooms: true
    }
  });
}

const hotelsRepository = {
  findEnrollmentByUserId,
  findPaidTicket,
  findManyHotels,
  findManyRooms
};

export default hotelsRepository;
