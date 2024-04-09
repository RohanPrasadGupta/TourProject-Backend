const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted All');
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
