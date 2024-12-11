const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();


app.use(express.json());
app.use(cors());



mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
});

const reviewsRoutes = require('./routes/Reviews.routes');
const employeeRoutes = require('./routes/Employee.routes');

app.use('/api/reviews', reviewsRoutes);
app.use('/api/employees', employeeRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});