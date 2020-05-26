const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have an author'],
    },
  },
  {
    toJSON: { virtuals: true }, //What this does is when we have a field that doesn't appear in the DB but is used for calculations,
    toObject: { virtuals: true }, //It actually shows when there's output
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

/* So, mindfuck incoming. We used pre here, but it's wrong, because by then the review is still not in DB
, hence it is not taken into account */
reviewSchema.post('save', function () {
  // this points to the current review

  this.constructor.calcAverageRatings(this.tour);
  // Here we had a next() call, but post middleware doesn't get access to it
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  /* 
  MF -> This is a query middleware, so kw this point to the query made.
  Therefore we do NOT have access to the document through "this" i.e. review and its data
  Which is what we need in order to execute operation on the tour it belongs to.
  So, the trick right below is a little hack to gain access to the document
   */
  this.r = await this.findOne(); // and now we persisted data through the lifecycle
  console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  //await this.findOne() -> does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
