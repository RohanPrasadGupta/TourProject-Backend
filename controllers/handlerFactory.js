const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      throw new Error(' No Document have been found with the Id');
    }

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
};

exports.updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      throw new Error('No document found for the given ID');
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);

    if (!doc) {
      throw new Error('No document found for the given ID');
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getOne = (Model, popOption) => async (req, res, next) => {
  try {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;

    if (!doc) {
      throw new Error(`No document found Found`);
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
    next();
  } catch (err) {
    res.status(404).json({
      status: 'Invalid',
      message: err.message,
    });
  }
};

exports.getAll = (Model) => async (req, res) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    if (!doc) {
      throw new Error(`No document found Found`);
    }
    res.status(200).json({
      status: 'Success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};
