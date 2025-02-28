import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getFilms() {
    const [resultRows] = await pool.query(`SELECT * FROM film`)
    return resultRows
}

export async function getFilmsWGenre() {
    const [resultRows] = await pool.query(`SELECT film.film_id, film.title, film.description, film.rating, film.special_features, film.release_year, category.name AS genre FROM film, film_category, category WHERE film.film_id = film_category.film_id AND film_category.category_id = category.category_id GROUP BY film.film_id, category.category_id ORDER BY film.film_id;`)
    return resultRows
}

export async function getFilmsGenreActorsByActors() {
    const [resultRows] = await pool.query(`SELECT film.film_id, film.title, film.description, category.name AS genre, film.rating, film.release_year, film.rental_rate, film.length, film.replacement_cost, film.special_features, actor.actor_id, CONCAT(actor.first_name, ' ', actor.last_name) AS actor_name FROM film, film_actor, actor, film_category, category WHERE film.film_id = film_actor.film_id AND film_actor.actor_id = actor.actor_id AND film.film_id = film_category.film_id AND film_category.category_id = category.category_id GROUP BY film.film_id, category.category_id, actor.actor_id ORDER BY actor.actor_id;`)
    return resultRows
}

export async function getFilmsGenreActorsByFilms() {
    const [resultRows] = await pool.query(`SELECT film.film_id, film.title, film.description, category.name AS genre, film.rating, film.release_year, film.rental_rate, film.length, film.replacement_cost, film.special_features, actor.actor_id, CONCAT(actor.first_name, ' ', actor.last_name) AS actor_name FROM film, film_actor, actor, film_category, category WHERE film.film_id = film_actor.film_id AND film_actor.actor_id = actor.actor_id AND film.film_id = film_category.film_id AND film_category.category_id = category.category_id GROUP BY film.film_id, category.category_id, actor.actor_id ORDER BY film.film_id;`)
    return resultRows
}

export async function getTop5Films() {
    const [top5FilmRows] = await pool.query(`SELECT film.film_id, film.title, film.description, film.release_year, film.rating, category.name AS genre, COUNT(rental.inventory_id) AS rented FROM film, film_category, category, inventory, rental WHERE rental.inventory_id = inventory.inventory_id AND inventory.film_id = film.film_id AND film.film_id = film_category.film_id AND film_category.category_id = category.category_id GROUP BY film.film_id, category.category_id ORDER BY rented DESC LIMIT 5;`)
    return top5FilmRows
}

export async function getTop5Actors() {
    const [top5FilmActors] = await pool.query(`SELECT actor.actor_id, actor.first_name, actor.last_name, COUNT(film_id) AS rented FROM actor,film_actor WHERE actor.actor_id = film_actor.actor_id GROUP BY actor_id ORDER BY rented DESC LIMIT 5;`)
    return top5FilmActors
}

export async function getActorsTop5(actor_id) {
    const [actorsTop5Films] = await pool.query(`SELECT film.film_id, film.title, COUNT(rental.inventory_id) AS rental_count FROM film, rental, inventory, film_actor WHERE film.film_id = inventory.film_id AND film.film_id = film_actor.film_id AND inventory.film_id = film_actor.film_id AND rental.inventory_id = inventory.inventory_id AND film_actor.actor_id = ? GROUP BY film.film_id ORDER BY rental_count DESC LIMIT 5;`
    , [actor_id])
    return actorsTop5Films
}

export async function getActorsFilms(actor_id) {
    const [actorsTop5Films] = await pool.query(`SELECT film.film_id, film.title, film_actor.actor_id, actor.first_name, actor.last_name FROM film, film_actor, actor WHERE film.film_id = film_actor.film_id AND film_actor.actor_id = ? AND film_actor.actor_id = actor.actor_id;`
    , [actor_id])
    return actorsTop5Films
}

export async function getFilm(id) {
    const [resultRow] = await pool.query(`SELECT * FROM film WHERE film_id = ?`
    , [id])
    return resultRow[0]
}

export async function getRentableCopies(film_id) {
    const [rentableCopies] = await pool.query(`SELECT DISTINCT inventory.film_id, rental.inventory_id AS 'rentableID' FROM rental, inventory WHERE rental.inventory_id=inventory.inventory_id AND inventory.film_id=? AND rental.inventory_id NOT IN (SELECT rental.inventory_id FROM rental WHERE rental.return_date IS NULL);`
    , [film_id])
    return rentableCopies
}

export async function getCustomers() {
    const [customerResultRows] = await pool.query(`SELECT * FROM customer`)
    return customerResultRows
}

export async function getCustomerIDs() {
    const [customerResultRows] = await pool.query(`SELECT customer_id FROM customer`)
    return customerResultRows
}

export async function getCustomer(id) {
    const [resultRow] = await pool.query(`SELECT * FROM customer WHERE customer_id = ?`
    , [id])
    return resultRow[0]
}


// The following is a reference for how to define a CREATE function for POST requests, don't actually invoke to modify sakila db too much
export async function createCustomer(customer_id, store_id, first_name, last_name, email, address_id, active, create_date) {
    const [resultCustomerCreate] = await pool.query(`INSERT INTO customer (customer_id, store_id, first_name, last_name, email, address_id, active, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    , [customer_id, store_id, first_name, last_name, email, address_id, active, create_date])
    return getCustomer(customer_id)
}

export async function rentMovie(inventory_id, customer_id) {
    const [resultRental] = await pool.query(`INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id) VALUES (CURRENT_TIMESTAMP, ?, ?, NULL, 1)`
    , [inventory_id, customer_id])
    return resultRental[0]
}

// CREATE FIRST CALL
// const userCreate = await createCustomer(600,1,'Fardeen','Iqbal','fi43@njit.edu',605,1,'2025-02-8 10:09:00')
// CREATE USER SECOND CALL
// const userCreate = await createCustomer(601,1,'Aidan','Barrera','ab43@njit.edu',605,1,'2025-02-8 10:012:00')
// CREATE RENTAL FIRST CALL
//const createRental = await rentMovie(19, 600)
//console.log(createRental)