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

function checkValuePages(value) {
    if(!value) {
        return value = 1;
    } else if(value < 1) {
        return value = 1;
    } else {
        return value;
    }
};

function checkValueElements(value) {
    if(!value) {
        return value = 5;
    } else if(value < 1) {
        return value = 5;
    } else {
        return value;
    }
};

app.get("/users", function(req, res){
    let countPage = req.query.page;
    countPage = checkValuePages(countPage);
    let countElements = req.query.quantity;
    countElements = checkValueElements(countElements);
    let sql1 = `SELECT * FROM users WHERE personID > '${((countPage - 1) * countElements)}' LIMIT ${countElements}`;
    let sql2 = `SELECT MAX(personID) FROM users`;
    pool.query(sql2, function(err, data) {
        if(err) return console.log(err);
        quantityUsers = (data[0]['MAX(personID)']);
        pool.query(sql1, function(err, data) {
            if(err) return console.log(err);
            res.send({ data, quantityUsers })
        });
    });
});

app.get("/profile/:id", function(req, res){
    const id = req.params.id;
    let sql1 = `SELECT * FROM users WHERE personID = ${id}`;
    let sql2 = `SELECT * FROM posts  WHERE id_user = ${id}`;
    let userData = [];
    let userPosts = [];
    pool.query(sql1, function(err, data) {
        if(err) return console.log(err);
        userData.push(data);
        pool.query(sql2, function(err, data) {
            if(err) return console.log(err);
            userPosts.push(data)
            res.send({ userData, userPosts })
        });
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
