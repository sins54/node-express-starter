/**
 * Standardized API response helper class
 */
class ApiResponse {
  /**
   * Create a success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {Object|Array|null} data - Response data
   * @returns {Object} Express response
   */
  static success(res, statusCode = 200, message = 'Success', data = null) {
    const response = {
      status: 'success',
      message
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Create a success response with pagination
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {Array} data - Response data array
   * @param {Object} pagination - Pagination info
   * @returns {Object} Express response
   */
  static successWithPagination(res, statusCode = 200, message = 'Success', data = [], pagination = {}) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      results: data.length,
      pagination,
      data
    });
  }

  /**
   * Create a created response (201)
   * @param {Object} res - Express response object
   * @param {string} message - Response message
   * @param {Object} data - Created resource data
   * @returns {Object} Express response
   */
  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, 201, message, data);
  }

  /**
   * Create a no content response (204)
   * @param {Object} res - Express response object
   * @returns {Object} Express response
   */
  static noContent(res) {
    return res.status(204).send();
  }
}

export default ApiResponse;
