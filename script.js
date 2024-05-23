const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controlers/register');
const signin = require('./controlers/signin');
const profile = require('./controlers/profile');
const image = require('./controlers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'ntobo1800',
    database: 'smart-brain',
  },
});

const app = express();
app.use(express.json());
app.use(cors());

// Home route to check server status
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Sign in route
app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

// Register route
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// Profile route
app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db); // Pass db to handleImage
});

// Start the server
app.listen(3000, () => {
  console.log('app is running on port 3000');
});