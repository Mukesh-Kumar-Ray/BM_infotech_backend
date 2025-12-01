// **** Backend entrypoint
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import formsRouter from './routes/forms.route.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/forms', formsRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(() => {
  console.log('*** MongoDB connected ***');
  app.listen(PORT, () => {
    console.log(`*** Server running on http://localhost:${PORT} ***`);
  });
}).catch(err => {
  console.error('Mongo connection error', err);
});
