import express from 'express'
import { getFilms, getTop5Films, getTop5Actors, getActorsTop5, getFilm, getRentableCopies, getFilmsWGenre, getFilmsGenreActorsByActors, getFilmsGenreActorsByFilms, getCustomers, getCustomer, createCustomer, rentMovie, getCustomerIDs } from './database.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())


app.get("/films", async (req, res) => {
    const films = await getFilms()
    res.send(films)
})


app.get("/films/top5films", async (req, res) => {
    const top5films = await getTop5Films()
    res.send(top5films)
})


app.get("/actors/:id/top5films", async (req, res) => {
    const actor_id = req.params.id
    const actorsTop5 = await getActorsTop5(actor_id)
    res.send(actorsTop5)
})


app.get("/films/:id/rentable", async (req, res) => {
    const film_id = req.params.id
    const rentableCopies = await getRentableCopies(film_id)
    res.send(rentableCopies)
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

app.get("/everyFilmByActor", async (req, res) => {
    const films = await getFilmsGenreActorsByActors()
    res.send(films)
})

app.get("/everyFilmByFilm", async (req, res) => {
    const films = await getFilmsGenreActorsByFilms()
    res.send(films)
})


app.get("/actors/top5actors", async (req, res) => {
    const top5actors = await getTop5Actors()
    res.send(top5actors)
})


app.get("/customers", async (req, res) => {
    const customers = await getCustomers()
    res.send(customers)
})

app.get("/customerIDs", async (req, res) => {
    const customerIDs = await getCustomerIDs()
    res.send(customerIDs)
})

app.get("/customers/:id", async (req, res) => {
    const id = req.params.id
    const customer = await getCustomer(id)
    res.send(customer)
})


app.post("/customers", async (req, res) => {
    const { customer_id, store_id, first_name, last_name, email, address_id, active, create_date } = req.body
    const newCustomer = await createCustomer(customer_id, store_id, first_name, last_name, email, address_id, active, create_date)
    res.status(201).send(newCustomer)
})

app.post("/rentAmovie", async(req, res) => {
    const { rentableID, customer_id } = req.body
    const newRental = await rentMovie(rentableID, customer_id)
    res.status(201).send(newRental)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


app.listen(8080, () => {
    console.log('Server is running on port 8080')
})