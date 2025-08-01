import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OrganizationMiddleware implements NestMiddleware {
  use(req: Request & { organizationId?: number; user?: any }, res: Response, next: NextFunction) {
    if (req.user && req.user.organizationId) {
      req.organizationId = req.user.organizationId;
    }
    next();
  }
}
