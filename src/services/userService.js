import User from '#models/User';
import AppError from '#utils/AppError';

/**
 * User Service - Contains all business logic for user operations
 * Services return plain objects, never send HTTP responses
 */
class UserService {
  /**
   * Get all active users
   * @returns {Promise<Array>} Array of user objects
   */
  async getAllUsers() {
    const users = await User.find({ active: true });
    return users;
  }

  /**
   * Get a single user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   * @throws {AppError} If user not found
   */
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('No user found with that ID', 404);
    }
    return user;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} [userData.role] - User role
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    const user = await User.create(userData);
    return user;
  }

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object
   * @throws {AppError} If user not found
   */
  async updateUser(id, updateData) {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    if (!user) {
      throw new AppError('No user found with that ID', 404);
    }
    return user;
  }

  /**
   * Soft delete a user (set active to false)
   * @param {string} id - User ID
   * @returns {Promise<void>}
   * @throws {AppError} If user not found
   */
  async deleteUser(id) {
    const user = await User.findByIdAndUpdate(id, { active: false });
    if (!user) {
      throw new AppError('No user found with that ID', 404);
    }
  }
}

export default new UserService();
