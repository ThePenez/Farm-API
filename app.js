import express from 'express';

import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from 'express-rate-limit';

import buildingsRouter from './routes/buildings.js';
import unitsRouter from './routes/units.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world');
});

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/api/v1/buildings', buildingsRouter);
app.use('/api/v1/units', unitsRouter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
