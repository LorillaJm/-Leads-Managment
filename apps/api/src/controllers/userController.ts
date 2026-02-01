import { Response, NextFunction } from 'express';
import { UserService } from '../services/userService.js';
import { AuthRequest } from '../middleware/auth.js';
import { 
  createUserSchema, 
  updateUserSchema, 
  resetPasswordSchema, 
  userFiltersSchema 
} from '../schemas.js';
import { UserStatus } from '../types.js';
import { AppError } from '../middleware/errorHandler.js';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = userFiltersSchema.parse(req.query);
      const result = await userService.getAllUsers(filters, req.user!.role);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id, req.user!.role, req.user!.id);

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await userService.createUser(data, req.user!.role);

      res.status(201).json({
        success: true,
        data: { user },
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateUserSchema.parse(req.body);
      const user = await userService.updateUser(id, data, req.user!.role);

      res.json({
        success: true,
        data: { user },
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = resetPasswordSchema.parse(req.body);
      const result = await userService.resetUserPassword(id, data, req.user!.role);

      res.json({
        success: true,
        data: result,
        message: 'Password reset successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(UserStatus).includes(status)) {
        throw new AppError('Valid status is required', 400);
      }

      const user = await userService.updateUserStatus(id, status, req.user!.role, req.user!.id);

      res.json({
        success: true,
        data: { user },
        message: `User ${status === UserStatus.ACTIVE ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      next(error);
    }
  }

  async getSalesConsultants(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const salesConsultants = await userService.getSalesConsultants();

      res.json({
        success: true,
        data: { salesConsultants }
      });
    } catch (error) {
      next(error);
    }
  }
}
