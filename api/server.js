import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import handleRegister from './controllers/register.js'
import handleSignin from './controllers/signin.js';
import handleImage, { handleApiCall } from './controllers/image.js';
import handleProfile from './controllers/profile.js';

const app = express();


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'password',
      database : 'smartbrain'
    }
});


app.use(express.json());
app.use(cors());


app.post('/signin', (req, res) => handleSignin(req,res,db,bcrypt))
app.post('/register', (req,res) => handleRegister(req,res,db,bcrypt))
app.put('/image', (req, res) => handleImage(req,res,db))
app.get('/profile/:id', (req, res) =>  handleProfile(req,res,db))
app.post('/imageurl', (req, res) => handleApiCall(req, res))


app.listen(3000, () => {
    console.log('App is running on port 3000')
})

