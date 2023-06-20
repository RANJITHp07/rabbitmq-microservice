import express from 'express';
import useRoute from './routes/productRouter';
import connectDB from '../db';
import { connect } from '../channel';

const app = express();

app.use(express.json());

app.use(useRoute);

connectDB()
  .then(() => {
      app.listen(3000, () => {
        console.log('Connected to 3000');
      });
    });

