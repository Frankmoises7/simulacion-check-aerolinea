# Postulacion-simulacion-check-in-Bsale
Application exercise Airline check-in simulation - for BSALE

This is a API Rest for Application exercise Airline check-in simulation - for BSALE in JavaScript with Express.

### Install

```bash
npm install
```

### Quick Start

```bash
npm run dev
```

or

```bash
npm start
```

### How does it works 

To create the solution, first create a server with express and generate the queries.
The first thing I did was to pull the database (with prism) to create a schema of the information.
then create a controller with an asynchronous function to be able to query the information to the database.
First I got the flight information through the ID we passed in the URL.
then I get the BoardingPass data in relation to the flight id.
then I get the passengers who have a boardingPass with the flight id.
I get the seatId of the db.
I assign fetched properties to the passenger to display in the response.
I order the passengers by purchase and then I assign them a seat.
If the passenger is a minor, I assign a seat next to the adult who is in the same purchase.
then I show the data.

For everything to work you must use the url where the project is deployed and add the following route:

**/flights/:id/passengers**


### Folder structure

**controllers:** Controllers are the main logic of the application. This controllers will be called by the routes.

**prisma:** Prisma are the main data of the application. contains the schema/model of the database.

**routes:** Routes are the endpoints declarations for controllers.

### Files

**index.js:** This file is the entry point of the application. It will mount the server.

**app.js:** This file is the main application file. It will be used to configure the express application.
