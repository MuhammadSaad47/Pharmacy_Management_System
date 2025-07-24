const path = require("path");
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const supplierRoutes = require('./routes/supplier');
const inventoryRoutes = require('./routes/inventory');
const userRoutes = require('./routes/user');
const salesRoutes = require('./routes/sales');
const doctorUserRoutes = require('./routes/doctorUser');
const doctorOderRoutes = require('./routes/doctorOders');
const verifiedDoctorOderRoutes = require('./routes/verifiedDoctorOder');
const pickedUpOdersRoutes = require('./routes/pickedUpOders');

// ✅ Changed: Using local MongoDB instead of Atlas
mongoose.connect('mongodb://localhost:27017/pharmacy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('connected to database!');
})
.catch(() => {
  console.log('connection failed!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use("/api/supplier", supplierRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/doctorUser", doctorUserRoutes);
app.use("/api/doctorOder", doctorOderRoutes);
app.use("/api/verifiedDoctorOder", verifiedDoctorOderRoutes);
app.use("/api/pickedUpOders", pickedUpOdersRoutes);

// Error handling middleware to log backend errors
app.use((error, req, res, next) => {
  console.error('❌ ERROR:', error.message);
  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
    error: error
  });
});

module.exports = app;
