let express = require('express');
let parser = require('body-parser');
let app = express();
let url = require('url');

const { MongoClient } = require('mongodb');
let connectionString = 'mongodb+srv://node-js-database:KLQQb4tSirWW6aez@cluster0.knqj1.mongodb.net/node-js-database?retryWrites=true&w=majority';

app.use(express.static('public'))
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.set('view engine','ejs');

MongoClient.connect(connectionString, {useUnifiedTopology: true} , function (err,client){
    if (err) return console.error(err);

    let db = client.db('node-js-database'); 

    console.log('Connected to Database..');
    
    app.get('/', function(req, res) {
        res.render(__dirname + '/private/index.ejs');
    })

    app.get('/join-room' , function(req,res){
        let idRoom = url.parse(req.url , true).query.r;

        db.collection('room').find(
            {
                'room-key': idRoom
            }
        ).toArray()
        .then( result =>{
            if(Object.keys(result).length>0){
                db.collection(idRoom).find().toArray()
                .then(result => {
                    res.status(404);
                    res.render(__dirname + '/private/room.ejs' , {data : result , room : idRoom} );
                })
                .catch( err =>{
                    res.status(404);
                    res.render(__dirname + '/public/404.ejs')
                })      
            } else {
                res.status(404);
                res.render(__dirname + '/public/404.ejs')
            }
        })
        .catch( err =>{
            res.status(500);
            res.render(__dirname + '/public/500.ejs')
        })
    })

    app.post('/send',function(req,res){
        let date = new Date();
        let time = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        time += +" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

        let query = {
            username : req.body.username,
            string: req.body.message,
            time: time
        };
        
        db.collection(req.body.room).insertOne(query)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            res.status(err.status || 500);
            res.render(__dirname + '/public/500.ejs')
        })

    })

    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.render(__dirname + '/public/500.ejs')
    })
      
    app.use(function(req, res){
        res.status(404);
        res.render(__dirname + '/public/404.ejs')
    })
    
    app.listen(3000 , function(){
        console.log('Server start at http://localhost:3000');
    })

})

