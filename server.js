const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// console.log(process.env.PORT);

const app = require('./app');

const DB = process.env.MONGO_URL.replace(
  'PASSWORD_HERE',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connection Sucess');
  })
  .catch((err) => console.log(err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Port is running on ${PORT}... `);
});
