const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* AUTH */
app.use("/api/auth", require("./routes/auth.routes"));

/* USERS */
app.use("/api/users", require("./routes/users.routes"));

/* CATEGORIES */
app.use("/api/categories", require("./routes/categories.routes"));

/* PRODUCTS */
app.use("/api/products", require("./routes/products.routes"));

/* BATCHES */
app.use("/api/batches", require("./routes/batches.routes"));

/* STORAGE CONDITIONS */
app.use("/api/storage", require("./routes/storage.routes"));

/* INSPECTIONS */
app.use("/api/inspections", require("./routes/inspections.routes"));

/* RISK ANALYSIS */
app.use("/api/risk", require("./routes/risk.routes"));

/* ALERTS */
app.use("/api/alerts", require("./routes/alerts.routes"));

/* DASHBOARDS */
app.use("/api/dashboards", require("./routes/dashboards.routes"));

/* CHATBOT */
app.use("/api/chatbot", require("./routes/chatbot.routes"));

module.exports = app;