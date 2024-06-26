const fs = require('fs');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

// const Users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.createUser = factory.createOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getUser = factory.getOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      throw new Error('You cannot update password from here...');
    }

    const filterBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });

    next();
  } catch (err) {
    res.status(404).json({
      status: 'Invalid',
      message: err.message,
    });
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Invalid',
      message: err.message,
    });
  }
};

// exports.getAllUsers = async (req, res) => {
//   // res.status(500).json({
//   //   status: 'error',
//   //   message: 'This Route is not Defined Yet',
//   // });

//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     data: {
//       users,
//     },
//   });
// };

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This Route is not Defined Yet',
//   });
//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     Users,
//   //   },
//   // });
// };

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This Route is not Defined Yet',
//   });
//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     Users,
//   //   },
//   // });
// };
