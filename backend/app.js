const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { queryParser } = require("express-query-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/index");
const MongooseService = require("~/services/mongoose.service");
MongooseService.connectDB();
const app = express();

app.use(
	queryParser({
		parseNull: true,
		parseBoolean: true,
		parseUndefined: true,
		parseNumber: true,
	})
);
app.use(bodyParser.json());

app.use(
	cors({
		origin: process.env.FRONT_END_ORIGIN || "*",
		optionsSuccessStatus: 200,
	})
);

app.use("/public", express.static(path.join(__dirname, "./uploads")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
