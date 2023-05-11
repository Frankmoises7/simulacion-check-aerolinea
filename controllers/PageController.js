const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class PageController {
  async renderFlight(req, res) {

    const flightId = parseInt(req.params.id);

    //Obtengo la data del vuelo por el ID de la URL
    try {
      const data = await prisma.flight.findUnique({
        where: { flight_id: flightId },
      });

      //Si no hay data, error 400  
      if (!data) {
        return res.status(404).json({
          code: 400,
          data: {},
        });
      }

      //Obtengo los datos del BoardingPass en relacion al Id del vuelo
      const boardingPass = await prisma.boarding_pass.findMany({
        where: { flight_id: flightId },
      });

      //Obtengo los ID de los passengers
      const passengerBoardingPassId = boardingPass.map((pass) => {
        const passengersId = pass.passenger_id;
        return passengersId;
      });


      // Obtengo los passengers de la BD en relacion al ID (sin orden)
      const UnorderPassengers = await prisma.passenger.findMany({
        where: { passenger_id: { in: passengerBoardingPassId } },
      });

      //Obtengo los SeatId ordenados de forma Ascendente
      const seatId = await prisma.seat.findMany({
        orderBy: [{seat_id: "asc"}]
      })

      // Le asigno las propiedades faltantes a los Passengers para mostrar
      UnorderPassengers.forEach((passenger) => {
        const boardingPassenger = boardingPass.find(
          (pass) => pass.passenger_id === passenger.passenger_id
        );
        if (boardingPassenger) {
          passenger.passengerBoardingPassId = boardingPassenger.boarding_pass_id;
          passenger.purchaseId = boardingPassenger.purchase_id;
          passenger.seatTypeId = boardingPassenger.seat_type_id;
        }
      });

      // Funcion para agrupar passengers por el seatType y ordenarlos por purchase
      function orderPassengers(passengers) {
        return passengers.sort((a, b) => {
          if (a.seatTypeId === b.seatTypeId) {
            return a.purchaseId - b.purchaseId;
          } else {
            return a.seatTypeId - b.seatTypeId;
          }
        });
      }

      //Ordeno los passengers
      const passengers = orderPassengers(UnorderPassengers);

      //Le asigno un seat a los passengers ordenados
      passengers.forEach((passenger, i) => {
          if(passenger.age < 18 && passenger.purchaseId === passengers[i+1].purchaseId){
            passenger.seatId = seatId[i - 1].seat_id;
          }
          passenger.seatId = seatId[i].seat_id;
      });

      //Todo
      //FUNCION PARA LOS MENORES DE EDAD
      

      //Muestro toda la data
      res.status(200).json({
        code: 200,
        data,
        passengers,
      });

    } catch (error) {
      console.log(error);
      res.status(400).json({
        code: 400,
        errors: "could not connect to db",
      });
    }
  }

  renderNotFound(req, res) {
    res.json({
      code: 404,
      data: {},
    });
  }
}

module.exports = PageController;
