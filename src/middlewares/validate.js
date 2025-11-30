import AppError from '../utils/AppError.js';

/**
 * Creates a validation middleware using a Zod schema
 * @param {Object} schema - Zod schema object with body, query, and/or params
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    next();
  } catch (error) {
    const errorMessages = error.errors?.map((e) => e.message).join(', ') || error.message;
    next(new AppError(`Validation error: ${errorMessages}`, 400));
  }
};

export default validate;
