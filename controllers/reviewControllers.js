const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReview = factory.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.tour) req.body.user = req.user.id;

  next();
};

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.getReview = factory.getOne(Review);

// exports.getAllReview = async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const review = await Review.find();

//   try {
//     if (!review) throw new Error('No Review Found');

//     res.status(200).json({
//       status: 'success',
//       results: review.length,
//       data: {
//         review,
//       },
//     });

//     next();
//   } catch (err) {
//     res.status(404).json({
//       status: 'Invalid',
//       message: err.message,
//     });
//   }
// };

// exports.createReview = async (req, res, next) => {
//   try {
//     // Allow nested routes
// if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.tour) req.body.user = req.user.id;
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         review: newReview,
//       },
//     });
//     next();
//   } catch (err) {
//     res.status(404).json({
//       status: 'Invalid',
//       message: err.message,
//     });
//   }
// };
