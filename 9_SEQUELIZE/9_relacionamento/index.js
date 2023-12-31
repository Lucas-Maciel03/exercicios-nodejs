const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const User = require('./models/User')
const Adress = require('./models/Adress')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

const hbs = exphbs.create({
    partialsDir: ['views/partials']
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

//cadatrando
app.get('/users/create', (req, res) => {
    res.render('adduser')
})

app.post('/users/create', async (req, res) => {
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    if(newsletter === 'on'){
        newsletter = true
    } else {
        newsletter = false
    }

    await User.create({name, occupation, newsletter})

    res.redirect('/')
})

//Read (listando)
app.get('/', async (req, res) => {
    const users = await User.findAll({raw: true})

    console.log(users)

    res.render('home', {users})
})
//listando por id
app.get('/users/:id', async (req, res) => {
    const id = req.params.id

    const user = await User.findOne({raw: true, where: {id}})

    res.render('userview', {user})
})

//update
app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id

    const user = await User.findOne({raw: true, where: {id}})

    res.render('useredit', {user})
})

app.post('/users/update', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    if(newsletter === 'on'){
        newsletter = true
    } else {
        newsletter = false
    }

    const userData = {
        name, occupation, newsletter, id
    }

    await User.update(userData, {where: {id}})

    res.redirect('/')
})
//delete
app.post('/users/remove/:id', async (req, res) => {
    const id = req.params.id

    await User.destroy({where: {id}})

    res.redirect('/')
})

conn.sync({force: true})
.then(app.listen(port, () => console.log(`Listen in port ${port}`)))
.catch(err => console.log(err))