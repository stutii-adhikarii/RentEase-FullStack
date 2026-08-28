require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authController = require("./controller/authController");
const apartmentRoutes = require("./routes/apartmentRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();
// The React app runs on a different port (Vite, usually 5173). Browsers block
// that cross-origin request unless the API explicitly allows it.
app.use(cors());
app.use(express.json());

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.post("/api/register", authController.register);
app.post("/api/login", authController.login);

app.use("/api/apartments", apartmentRoutes);
app.use("/api/inquiries", inquiryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
