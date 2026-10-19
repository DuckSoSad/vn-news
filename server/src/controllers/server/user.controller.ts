import type { RequestHandler } from 'express';

import userService from '../../services/server/user.service.js';
import { catchAsync } from '../../utils/catch-async.js';

class UserController {
  index: RequestHandler = catchAsync(async (_req, res) => {
    const data = await userService.getAll();

    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  });
}

export default new UserController();
