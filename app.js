require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

const port = process.env.PORT || 3000;
const apiKey = process.env.weatherApiKey;

console.log(port);
console.log(apiKey);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index', {weather: null, error: null});
});

app.post('/', (req, res) => {
    let city = req.body.city,
        url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    request(url, (reqErr, reqRes, reqBody) => {
       if(reqErr){
           res.render('index', {weather: null, error: 'Error, please try again!'});
       }else{
           let weather = JSON.parse(reqBody);
           if(weather.main == undefined){
               res.render('index', {weather: null, error: 'Error, please try again!'});
           }else{
               let weatherText = `It's ${weather.main.temp} degress in ${weather.name}!`;
               res.render('index', {weather: weatherText, error: null});
           }
        }
    });
});