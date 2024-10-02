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

app.get('/register', (req, res)=>{
    res.render('register_user.ejs');
});

app.post('/register', async (req, res)=>{
    try{
        if(await User.findOne({name: req.body.name.trim()})){
            res.redirect('/register');
        }else{
            const pass = await bcrypt.hash(req.body.password.trim(), 10);

            User.create({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name.trim(),
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

app.post('/login', async (req, res)=>{
    try{
        const user = await User.findOne({
            name: req.body.name_login.trim()
        });

        if(!user){
            return res.redirect('/login');
        }

        if(bcrypt.compare(req.body.password_login.trim(), user.password)){
            req.session.user = user;
            return res.redirect('/page-initial');
        }else{
            return res.redirect('/login');
        }
    }catch(err){
        console.log('Erro ao validar login:', err);
        return res.status(500).send('Erro ao validar login. Tente novamente. <a href="/">Voltar</a>');
    }
});

app.get('/page-initial', (req, res)=>{
    if(req.session.user){
        return res.render('page_initial.ejs', {user: req.session.user.name});
    }else{
        return res.redirect('/login');
    }
});

app.get('/admin-users', (req, res)=>{
    if(req.session.user.name === 'felipe_e2458'){
        User.find({}).exec((err, users)=>{
            users = users.map((val)=>{
                return {
                    _id: val._id,
                    name: val.name,
                }
            });

            res.render('adm_users.ejs', {users: users});
        });
    }else{
        res.redirect('/login');
    }
});

app.get('/admin-users/delete/:id', (req, res)=>{
    User.findByIdAndDelete(req.params.id).then(result =>{
        res.redirect('/admin-users');
    }).catch(err =>{
        res.status(500).send('Erro ao tentar deletar usuário:' + err);
    });
});

app.listen(3090, ()=>{
    console.log('Server is running!');
});