const express = require('express')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const path = require('path')
const bp = require('body-parser')
const { faker } = require('@faker-js/faker')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
faker.locale = 'es'
app.use(express.json())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(cookieParser())

/***
 * { name: 'express', value: 'express', expires: 1000 }
 * 
 */
app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://chat:chat@cluster0.ky0aqm9.mongodb.net/session?retryWrites=true&w=majority' }),
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 40000
    }
}))

let productos = [
    {
        "name": faker.commerce.productName(),
        "price": faker.commerce.price()
    },
    {
        "name": faker.commerce.productName(),
        "price": faker.commerce.price()
    },
    {
        "name": faker.commerce.productName(),
        "price": faker.commerce.price()
    },
    {
        "name": faker.commerce.productName(),
        "price": faker.commerce.price()
    },
    {
        "name": faker.commerce.productName(),
        "price": faker.commerce.price()
    }
]

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    // const username = req.body.username
    // const password = req.body.password
    const { username, password } = req.query
    console.log(username);

    // Validacion de login (deberia hacerse comparando con informacion de base de datos)
    if (username === 'coderhouse' && password === 'coder2022') {
        req.session.user = username;
        req.session.admin = true;
        req.session.logged = true;
    } else if (username === 'pepe' && password === 'coder2022') {
        req.session.user = username;
        req.session.logged = true;
    } else {
        return res.send('Usuario o contraseña incorrecto')
    }


    res.render('login', { productos })
})

app.post('/logout', (req, res) => {
    let a = req.session.user
    req.session.destroy(error => {
        if (error) {
            res.send({ status: 'Logout Error', body: error })
        } else {
            //console.log(req.session.user);
            console.log(`Adios ${a}`)
            setTimeout(() => {
                res.redirect('/')
            }, 2000)
        }

    })


})

app.get('/getCookies', (req, res) => {
    res.send(req.cookies);
});

app.delete('/deleteCookies/:name', (req, res) => {
    res.clearCookie(req.params.name).send({ proceso: 'ok' });
});


const server = app.listen(8080, () => console.log('Server running on port 8080'));
server.on('error', error => console.log(`Error en el servidor ${error}`));