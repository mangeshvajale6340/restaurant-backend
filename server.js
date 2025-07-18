const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const bookingsRoute = require('./routes/bookings');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/bookings', bookingsRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
