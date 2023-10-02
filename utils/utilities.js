/**
 * Paginate results of a MongoDB query with additional metadata
 * @param {Model} model - The Mongoose model to query
 * @param {Query} query - The Mongoose query to execute
 * @param {number} page - The current page number
 * @param {number} limit - The number of results per page
 * @returns {Promise<Object>} - An object containing paginated results and metadata
 */
const paginate = async (model, query, page = 1, limit = 5) => {
  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  const results = await query.exec();
  let totalCount = results.length;

  const paginatedResults = await query
    .clone()
    .skip(skip)
    .limit(parseInt(limit))
    .populate('tags', 'name')
    .exec();

  const currentPage = page;
  const totalPages = Math.ceil(totalCount / limit);
  const totalResults = totalCount;

  return {
    results: paginatedResults,
    currentPage,
    totalPages,
    totalResults,
  };
};

export {paginate};
