import express from 'express';
import database from './utils/database';
import routes from './routes/api';
import bodyParser from 'body-parser';

const PORT = 3000;

async function init() {
  try {
    await database();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', routes);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
