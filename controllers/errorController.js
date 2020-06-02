const AppError = require('../utils/appError');

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message); // I know I am extracting the subjects of the response. But MORE understanding is needed.
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please, log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please, log in again', 401);

const handlePasswordRecentlyChanged = () =>
  new AppError('User recently changed password. Please, log in again', 401);

const sendErrorDev = (err, req, res) => {
  //.originalUrl doesn's start without the host, but like the routes (/api/v1...) --> This way we can test whether error comes from /api or not
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //RENDERED WEBSITE
  /* 
  This executes for the front-end routes. Being non-api errors, we need a non-api method of dealing with them.
  So we will render the template with the name 'error' 
  */
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API error? Enter here
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming or other unknown error: don't leak error details
    //1)Log error
    console.error('ERROR 💥', err);
    //2)Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  // B) RENDERED WEBSITE error? Then here
  if (err.isOperational) {
    //Operational, trusted error: send message to client
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  //Programming or other unknown error: don't leak error details
  //1)Log error
  console.error('ERROR 💥', err);
  //2)Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'jsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (
      error.message === 'User recently changed password. Please, log in again'
    )
      error = handlePasswordRecentlyChanged();
    sendErrorProd(error, req, res);
  }
};
