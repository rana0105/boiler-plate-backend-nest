import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentOrganizationId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.organizationId;
  },
);
