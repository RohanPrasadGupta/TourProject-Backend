const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const { userInfo } = require('os');

const signedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signedToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email and password exist
    if (!email || !password) {
      throw new Error('Please Enter Both Email and Password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error('Unable to Find the User or Wrong Password');
    }

    // console.log(user);

    // check if user exists && password is correct

    // If everything is ok send token to client
    createSendToken(user, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('TOKEN IS HERE:', token);

    if (!token) {
      throw new Error('You are not logged in.');
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      throw new Error('The user belong to this token does not exist.');
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
      throw new Error('The user Changed Password Login Again.');
    }

    req.user = freshUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new Error("You Don't have permission to perform this action");
      }
      next();
    } catch (err) {
      res.status(401).json({
        status: 'fail',
        message: err.message,
      });
    }
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new Error('No user Found With this Email');
  }
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });

  // Send uSer Email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `forget your password? submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you did't forget your password, ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 minutes',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    // res.status(401).json({
    //   status: 'fail',
    //   message: err.message,
    // });
    user.passwordResetToken = undefined;
    user.passwordRestExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      res.status(401).json({
        status: 'fail',
        message: err.message,
      })
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  // Get User Based on Token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  try {
    // set new password and there is user and token not expired

    if (!user) {
      throw new Error('Token is invalid or Expired');
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // update changePasswordAt property for the user

    // log the user in

    createSendToken(user, 201, res);
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  try {
    if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
      throw new Error('Your current Password is wrong: UnAuthorized');
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    createSendToken(user, 201, res);
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};
