const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const User = require('./model/User')
const Address = require('./model/Address')

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

app.get('/users/create', (req, res) => {
    res.render('adduser')
})

app.post('/users/create', async (req, res) => {
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    if(newsletter === 'on') {
        newsletter = true
    } else{
        newsletter = false
    }

    await User.create({name, occupation, newsletter})

    res.redirect('/')
})

app.get('/', async (req, res) => {
    const users = await User.findAll({raw: true})
    console.log(users)
    res.render('home', {users})
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id

    const user = await User.findOne({raw: true, where: {id}})

    res.render('userview', {user})
})

app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findOne({include: Address, where: {id}})
        res.render('useredit', {user: user.get({plain: true})})
    } catch (error) {
        console.log(error)
    }
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

    const userData = {id, name, occupation, newsletter}
    
    await User.update(userData, {where: {id}})

    res.redirect('/')
})

app.post('/users/remove/:id', async (req, res) => {
    const id = req.params.id

    await User.destroy({where: {id}})

    res.redirect('/')
})

app.post('/address/create', async (req, res) => {
    const UserId = req.body.UserId
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const addressData = {UserId, street, number, city}

    await Address.create(addressData)

    res.redirect(`/users/edit/${UserId}`)
})

app.post('/address/delete', async (req, res) => {
    const UserId = req.body.UserId
    const id = req.body.id

    await Address.destroy({where: {id}})

    res.redirect(`/users/edit/${UserId}`)
})

app.get('/address/edit/:id', async(req, res) => {

    const id = req.params.id

    try {
        const address = await Address.findOne({where: {id}})
        res.render('addressedit', {address: address.get({plain: true})})
    } catch (error) {
        console.log(error)
    }
})

app.post('/address/update', async (req, res) => {
    const UserId = req.body.UserId
    const id = req.body.id
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const addressData = {UserId, id, street, number, city}

    await Address.update(addressData, {where: {id}})

    res.redirect(`/users/edit/${UserId}`)
})

conn.sync()
.then(app.listen(port, () => console.log(`Listen in port ${port}`)))
.catch(err => console.log(err))
