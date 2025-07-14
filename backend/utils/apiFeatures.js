class APIFeatures {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter() {
    // 1. Basic Filtering
    const queryObj = { ...this.queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 2. Advanced Filtering (e.g. price[gte]=1000)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`, // Add MongoDB operator `$`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sort
    }
    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryParams.page, 10) || 1;
    const limit = parseInt(this.queryParams.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
