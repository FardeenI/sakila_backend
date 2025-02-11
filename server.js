import express from 'express'
import { getFilms, getTop5Films, getFilm, getCustomer, createCustomer } from './database.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", async (req, res) => {
    const top5films = await getTop5Films()
    res.send(top5films)
})

app.get("/films", async (req, res) => {
    const films = await getFilms()
    res.send(films)
})

app.get("/films/:id", async (req, res) => {
    const id = req.params.id
    const film = await getFilm(id)
    res.send(film)
})

app.post("/customers", async (req, res) => {
    const { customer_id, store_id, first_name, last_name, email, address_id, active, create_date } = req.body
    const newCustomer = await createCustomer(customer_id, store_id, first_name, last_name, email, address_id, active, create_date)
    res.status(201).send(newCustomer)
})

app.get("/customers/:id", async (req, res) => {
    const id = req.params.id
    const customer = await getCustomer(id)
    res.send(customer)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})