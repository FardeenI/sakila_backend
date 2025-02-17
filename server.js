import express from 'express'
import { getFilms, getTop5Films, getTop5Actors, getActorsTop5, getFilm, getFilmsWGenre, getCustomers, getCustomer, createCustomer } from './database.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.get("/films/top5films", async (req, res) => {
    const top5films = await getTop5Films()
    res.send(top5films)
})

app.get("/actors/top5actors", async (req, res) => {
    const top5actors = await getTop5Actors()
    res.send(top5actors)
})

app.get("/actors/:id/top5films", async (req, res) => {
    const actor_id = req.params.id
    const actorsTop5 = await getActorsTop5(actor_id)
    res.send(actorsTop5)
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

app.get("/filmsmodified", async (req, res) => {
    const films = await getFilmsWGenre()
    res.send(films)
})

app.get("/customers", async (req, res) => {
    const customers = await getCustomers()
    res.send(customers)
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