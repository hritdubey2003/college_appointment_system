import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import studentauth from './routes/studentauth.routes.js';
import professorauth from './routes/professorauth.routes.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>');
});

app.use('/students', studentauth );
app.use('/professors', professorauth );

app.listen( process.env.PORT , () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

connectDB();