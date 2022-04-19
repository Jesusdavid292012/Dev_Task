import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv'


const app = express();

dotenv.config();

connectDb();

//Routing

app.get('/', (req, res)=>{
res.send('pag principal')
})

const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{console.log('app corriendo en el puerto 4000')})