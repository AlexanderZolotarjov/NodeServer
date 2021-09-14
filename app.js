const express = require("express");
const fs = require("fs");
const mysql = require("mysql2");
    
const app = express();
const urlencodedParser = express.urlencoded({extended: false});


const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    port: '3306',
    user: 'mysql',
    database: 'socialnetwork',
    password: ''
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get("/users", function(req, res){
    let sql = "SELECT * FROM users"
    pool.query(sql, function(err, data) {
        if(err) return console.log(err);
        res.send(data)
    });
});

app.post("/newuser", urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    let sql = "INSERT INTO users (name, photo, followed) VALUES (?,?,?)"
    const name = req.body.name;
    const photo = req.body.photo;
    const followed = req.body.followed;
    pool.query(sql, [name, photo, followed], function(err, data) {
        if(err) return console.log(err);
        res.send('Success');
    });
});

app.listen(8000, '127.0.0.1', function(){
    console.log("Сервер ожидает подключения...");
});
