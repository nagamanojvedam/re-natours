module.exports = class {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    // basic filtering
    const tempObj = { ...this.queryObj };
    const excludeFields = ['page', 'limit', 'sort', 'fields'];

    excludeFields.forEach((el) => delete tempObj[el]);

    // advanced filtering
    const queryStr = JSON.stringify(tempObj).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (matchedStr) => `${matchedStr}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // sorting
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = +this.queryObj.page;

    const limit = +this.queryObj.limit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
};
