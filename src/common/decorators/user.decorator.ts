import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request?.user?.id as number | undefined;
});
