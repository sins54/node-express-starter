import userService from '#services/userService';
import catchAsync from '#utils/catchAsync';
import ApiResponse from '#utils/apiResponse';

/**
 * User Controller - Handles HTTP requests/responses only
 * All business logic is delegated to userService
 */

/**
 * Get all users
 * @route GET /api/v1/users
 */
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  ApiResponse.success(res, 200, 'Users retrieved successfully', { users });
});

/**
 * Get a single user by ID
 * @route GET /api/v1/users/:id
 */
export const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  ApiResponse.success(res, 200, 'User retrieved successfully', { user });
});

/**
 * Create a new user
 * @route POST /api/v1/users
 */
export const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  ApiResponse.created(res, 'User created successfully', { user });
});

/**
 * Update a user
 * @route PATCH /api/v1/users/:id
 */
export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  ApiResponse.success(res, 200, 'User updated successfully', { user });
});

/**
 * Delete a user (soft delete)
 * @route DELETE /api/v1/users/:id
 */
export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  ApiResponse.noContent(res);
});
