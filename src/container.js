const { createContainer, asClass, asValue } = require("awilix");

// models
const models = require("./models");

// services (classes)
const MovieService = require("./services/MovieService");
const AuthService = require("./services/AuthService");

// controllers (classes)
const MovieController = require("./controllers/MovieController");
const AuthController = require("./controllers/AuthController");

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

	// controllers
	movieController: asClass(MovieController).scoped(),
	authController: asClass(AuthController).scoped(),
});

module.exports = container;
