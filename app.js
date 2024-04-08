const express = require('express');
const morgan = require('morgan');
// const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`Hellow From middleWare`);
  req.reqestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/users', userRouter);

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
