require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(express.json());
app.use("/images", express.static("public/images"));


const userRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);


app.listen(PORT, () => console.log('listening on port', PORT));