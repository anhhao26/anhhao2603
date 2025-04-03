// const express = require('express');
// import express from 'express';
// const app = express();
// const PORT = 8000

// app.get('/',(req, res) => {
//     res.send('Hello world!');
// })
// app.listen(PORT, () => {
//     console.log(`Sever is running on http://localhost:${PORT}`);
// })


import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.get("/", (req, res) => {
  res.send("Trang chủ");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
