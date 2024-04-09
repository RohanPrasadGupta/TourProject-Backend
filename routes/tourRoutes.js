const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restricTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/')
  .get(tourController.getAllTour)
  .post(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router.param('id', tourController.checkID);

// app.get('/api/v1/tour', getAllTour);
// app.post('/api/v1/tour', createTour);

// app.get('/api/v1/tour/:id', getTour);
// app.patch('/api/v1/tour/:id', updateTour);
// app.delete('/api/v1/tour/:id', deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restricTo('user'),
//     reviewController.createReview
//   );

module.exports = router;
