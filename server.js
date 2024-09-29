const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./mongoose/User');

mongoose.connect('mongodb+srv://root:q8n7MKjqbgluikbZ@cluster0.zsdig.mongodb.net/Project-full?retryWrites=true&w=majority&appName=Cluster0' ,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Conectado com sucesso ao MongoDB");
}).catch((err)=>{
    console.log(err.message);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '124578963369784512',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'src/public')));
app.set('views', path.join(__dirname, '/src/pages'));

app.get('/', (req, res)=>{
    res.render('home.ejs');
});

app.get('/create-user', (req, res)=>{
    res.render('create_user.ejs');
});

app.post('/create-user', async (req, res)=>{
    try{
        if(await User.findOne({name: req.body.name})){
            res.redirect('/create-user');
        }else{
            const pass = await bcrypt.hash(req.body.password, 10);

            User.create({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                password: pass
            }).then(()=>{
                res.redirect('/login');
            }).catch(err =>{
                res.status(500).send("Erro ao tentar criar usuário:" + err);
            });
        }
    }catch{
        res.status(500).send();
    }
});

app.get('/login', (req, res)=>{
    res.render('login.ejs');
});

app.listen(3090, ()=>{
    console.log('Server is running!');
});