const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require(__dirname+"/routes/auth");


mongoose.connect(process.env.DB);

let app = express();

app.use(cors({
    origin: 'http://localhost:8100',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/public', express.static(__dirname + '/public'));



app.use(express.json());
app.use('/auth', auth);

app.listen(process.env.PORT);