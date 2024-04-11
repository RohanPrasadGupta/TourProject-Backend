const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
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
