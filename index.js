const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require(__dirname+"/routes/auth");
const producte = require(__dirname+"/routes/producte");
const cistella = require(__dirname+"/routes/cistella");



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
app.use('/producte', producte);
app.use('/cistella', cistella);


app.listen(process.env.PORT);