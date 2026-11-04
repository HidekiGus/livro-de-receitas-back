import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema';
import * as userController from '../controllers/userController';
import { newUserSchema } from '../schemas/newUserSchema';
import { userSchema } from '../schemas/userSchema';

const userRouter = Router();

userRouter.post(
  '/signup',
  validateSchema(newUserSchema),
  userController.createUser
);
userRouter.post('/login', validateSchema(userSchema), userController.login);
userRouter.get('/', userController.getStatusCheck);
userRouter.get('/users', userController.getUsers);

export default userRouter;
