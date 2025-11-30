import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import validate from '../middlewares/validate.js';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema
} from './validations/userValidation.js';

const router = Router();

router.route('/')
  .get(getAllUsers)
  .post(validate(createUserSchema), createUser);

router.route('/:id')
  .get(validate(getUserSchema), getUser)
  .patch(validate(updateUserSchema), updateUser)
  .delete(validate(getUserSchema), deleteUser);

export default router;
