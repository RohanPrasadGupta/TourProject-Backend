const express = require('express');
const morgan = require('morgan');
const path = require('path');
// const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitiza = require('express-mongo-sanitize');
const xss = require('xss-clean');
const globalErrorHandler = require('./controllers/errorController');
const hpp = require('hpp');
// Routes Below
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
// app.use(morgan('dev'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// setting up HTTP header security
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Setting limit for same Api request to server
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request. please try again later',
});

app.use('/api', limiter);

// Body parser, reading data from body into rq.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data Sanitazation against NoSQL query injection
app.use(mongoSanitiza());

// Data security against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test Middleware
app.use((req, res, next) => {
  console.log(`Hellow From middleWare`);
  req.reqestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  //   next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
  // });
  // OR

  res.status(404).json({
    status: 'fail',
    message: `cannot find ${req.originalUrl} on this site`,
  });
  next();

  // OR

  // const err = new Error(`can't find ${req.originalUrl} on this server!`);

  // err.ststus = 'fail';
  // err.ststusCode = 404;
  // next(err);
});

app.use(globalErrorHandler);

module.exports = app;
