//FEATURES CLASS - NO F# IDEA YET
class APIFeatures {
  constructor(query, queryString) {
    /* 
      queryString must be what we got from the req.query. 
      And query is the result of Tours.find().
      Once we get everything, then we filter and parse it
      */
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let { page, sort, limit, fields, ...queryObj } = this.queryString;

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
    /* 
      So there goes the brain fuck. Why are we returning "this"?
      Because in order to be able to chain all the features on 
      ||const features = new APIFeatures(Tour.find(), req.query).filter().sort();||
      they have to return something so that the next chain has something to work on. 
      This, therefore, returns the whole object... or something.
      */
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(this.fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
