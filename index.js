const express = require('express');
const mongoose = require('mongoose');


const auth = require(__dirname+"/routes/auth");


mongoose.connect(process.env.DB);

let app = express();

app.use(express.json());
app.use('/auth', auth);

app.listen(process.env.PORT);