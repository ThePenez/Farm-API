const express = require('express');

const app = express();

const buildingsRouter = require('./routes/buildings');
const unitsRouter = require('./routes/units');

app.get('/', (req, res) => {
  res.send('Hello, world');
});

app.use(express.json());

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
