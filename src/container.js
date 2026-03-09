const { createContainer, asClass, asValue } = require("awilix");

// models
const models = require("./models");

// services (classes)
const MovieService = require("./services/MovieService");
const AuthService = require("./services/AuthService");
const ScreeningService = require("./services/screeningService");
const ReservationService = require("./services/reservationService");
const RoomService = require("./services/roomService");


// controllers (classes)
const MovieController = require("./controllers/MovieController");
const AuthController = require("./controllers/AuthController");
const ScreeningController = require("./controllers/screeningController");
const ReservationController = require("./controllers/reservationController");
const RoomController = require("./controllers/roomController");



const container = createContainer();

// register everything
container.register({
	// Sequelize + models
	sequelize: asValue(models.sequelize),

	Movie: asValue(models.Movie),
	User: asValue(models.User),
	Room: asValue(models.Room),
	Screening: asValue(models.Screening),
	Reservation: asValue(models.Reservation),

	// services
	movieService: asClass(MovieService).scoped(),
	authService: asClass(AuthService).scoped(),
	screeningService: asClass(ScreeningService).scoped(),
	reservationService: asClass(ReservationService).scoped(),
	roomService: asClass(RoomService).scoped(),
	screeningService: asClass(ScreeningService).scoped(),
	

	// controllers
	movieController: asClass(MovieController).scoped(),
	authController: asClass(AuthController).scoped(),
	screeningController: asClass(ScreeningController).scoped(),
	reservationController: asClass(ReservationController).scoped(),
	roomController: asClass(RoomController).scoped(),
	screeningController: asClass(ScreeningController).scoped(),
	
	
});

module.exports = container;
