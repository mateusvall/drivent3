import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotelWithRooms() {
  return prisma.hotel.create({
    data: {
      name: "Hotel do Mal",
      image: "imagem",
      Rooms: {
        create: {
          name: "Quarto do Mal",
          capacity: 2
        }
      }
    },
    include: {
      Rooms: true
    }
  });
}
