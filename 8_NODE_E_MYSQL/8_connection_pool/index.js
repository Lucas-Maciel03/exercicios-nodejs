const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')
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

//Rota home
app.get('/', (req, res) => {
    res.render('home')
})

//Create book
app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO books(title, pageqty) VALUES('${title}', '${pageqty}')`

    pool.query(sql, function(err){
        if(err){
            console.log(err)
        }
        
        res.redirect('/books')
    })

})

//Select books
app.get('/books', (req, res) => {
    const sql = `SELECT * FROM books`

    pool.query(sql, function(err, data) {
        if(err){
            console.log(err)
            return
        }
        const books = data
        console.log(books)
        res.render('books', {books})
    })
})

//select books with id
app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`

    pool.query(sql, function(err, data) {
        if(err){
            console.log(err)
            return
        }
        const book = data[0]
        console.log(book)
        res.render('book', {book})
    })
})

//Select book to update
app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id 

    const sql = `SELECT * FROM books WHERE id = ${id}`

    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]
        res.render('editbook', {book})
    })

    
})
//post update book
app.post('/books/updatebook', (req, res) => {
    const title = req.body.title
    const pageqty = req.body.pageqty
    const id = req.body.id

    const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

    pool.query(sql, function(err) {
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

//post delete book
app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM books WHERE id = ${id}`

    pool.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

       res.redirect('/books')
    })
})

app.listen(port, () => console.log(`Listen in port ${port}`))