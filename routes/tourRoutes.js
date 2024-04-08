const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

// app.get('/api/v1/tour', getAllTour);
// app.post('/api/v1/tour', createTour);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createTour);

// app.get('/api/v1/tour/:id', getTour);
// app.patch('/api/v1/tour/:id', updateTour);
// app.delete('/api/v1/tour/:id', deleteTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restricTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
