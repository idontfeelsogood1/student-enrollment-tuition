const express = require("express");
const cors = require("cors");
const config = require("./config/env");
const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
