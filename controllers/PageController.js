const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class PageController {
  async renderFlight(req, res) {
    const flightId = parseInt(req.params.id);

    try {
      const data = await prisma.flight.findUnique({
        where: { flight_id: flightId },
      });

      if (!data) {
        return res.status(404).json({
          code: 400,
          data: {},
        });
      }

      const boardingPass = await prisma.boarding_pass.findMany({
        where: { flight_id: flightId },
      });

      const passengerBoardingPassId = boardingPass.map((pass) => {
        const passengersId = pass.passenger_id;
        return passengersId;
      });

      const UnorderPassengers = await prisma.passenger.findMany({
        where: { passenger_id: { in: passengerBoardingPassId } },
      });


      UnorderPassengers.forEach((passenger) => {
        const boardingPassenger = boardingPass.find(
          (pass) => pass.passenger_id === passenger.passenger_id
        );
        if (boardingPassenger) {
          passenger.passengerBoardingPassId = boardingPassenger.boarding_pass_id;
          passenger.purchaseId = boardingPassenger.purchase_id;
          passenger.seatTypeId = boardingPassenger.seat_type_id;
          passenger.seatId = boardingPassenger.seat_id;
        }
      });

      function order(arr) {
        return arr.sort((a, b) => a.seatTypeId - b.seatTypeId);
      }

      const passengers = order(UnorderPassengers);
      


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
