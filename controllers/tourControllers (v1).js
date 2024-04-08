const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// CREATING MIDDLEWARE

// CHECK ID
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour ID is: ${val} `);
//   if (Number(req.params.id) > tours.length)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   next();
// };

// CHECK BODY CONTENT

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price)
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Invalid Inputs Name or Price',
//     });
//   next();
// };

// Refactoring

// ---------------------------------------------------------
// Exporting Routes Funcitons Below
exports.getAllTour = async (req, res) => {
  // console.log(req.query);
  try {
    //Filtering
    // const queryObj = { ...req.query };
    // const excludeFields = ['page', 'sort', 'limits', 'fields'];
    // excludeFields.forEach((el) => delete queryObj[el]);

    // console.log(req.query, queryObj);
    // //Advance Filtering
    // // {"duration":{"gt":"5"},"difficulty":"easy"} need to replace all gt or operatior to $gt
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    // Sorting Accordint to fileds
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // Field Limitation Filtering the fields

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // Paginations

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTour = await Tour.countDocuments();
    //   if (skip >= numTour) throw new Error('Page not Exit');
    // }

    //Execution Query

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }

  // Using Express and Api testing Check
  // console.log(req.reqestTime);
  // res.status(200).json({
  //   status: 'Success',
  //   results: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
};

exports.getTour = async (req, res) => {
  // For Using Monogo Db and data creating test
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Invalid',
      message: err.message,
    });
  }

  // Using Express and Api testing Check

  // console.log(req.params);

  // const id = Number(req.params.id);
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'Success',
  //   data: {
  //     tour,
  //   },

  // results: tours.length,
  // data: {
  //   tours,
  // },
  // });
};

exports.createTour = async (req, res) => {
  //   console.log(req.body);
  // For Using Monogo Db and data creating test

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }

  // Using Express and Api testing Check
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  // For Using Monogo Db and data creating test

  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success Deleted Tour',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }

  // Using Express and Api testing Check
  // console.log(req.params);
  // return res.status(204).json({
  //   status: 'success',
  //   data: {
  //     tour: null,
  //   },
  // });
};
