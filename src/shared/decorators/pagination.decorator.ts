import { applyDecorators, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { createPagination } from 'src/adapters/pagination/pagination.helper';

export const Pagination = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return createPagination(request.query.page, request.query.perPage);
});

export const CommonQueryRequest = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      schema: {
        type: 'integer',
        minimum: 0,
      },
      example: 1,
      description: 'Page number',
      required: false,
    }),
    ApiQuery({
      name: 'perPage',
      schema: {
        type: 'integer',
        minimum: 0,
      },
      example: 20,
      description: 'Limit per page',
      required: false,
    }),
  );
};
