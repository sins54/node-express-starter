import User from '../models/User.js';
import AppError from '../utils/AppError.js';

/**
 * Get all users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ active: true });
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single user by ID
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 */
export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a user
 */
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user (soft delete)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { active: false });
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
