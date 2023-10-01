/**
 * Paginate results of a MongoDB query
 * @param {Model} model - The Mongoose model to query
 * @param {number} page - The current page number
 * @param {number} limit - The number of results per page
 * @returns {Promise<Object>} - Paginated results with metadata
 */
const paginate = async (model, query, page = 1, limit = 5) => {
  const skip = (page - 1) * limit;

  const totalCount = await model.countDocuments();
  const results = await query
    .skip(skip)
    .limit(parseInt(limit))
    .populate('tags', 'name')
    .exec();

  return {
    results,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalResults: totalCount,
  };
};

export {paginate};
