/* istanbul ignore file */
import { IPaginationHeader, IPagination } from './pagination.interface';
import { Injectable } from '@nestjs/common';
export const maxNumberOfRecordPerPage = 100;
export enum PaginationMetadataStyle {
  Header = 'header',
  Body = 'body',
}

@Injectable()
export class PaginationHeaderHelper {
  public getHeaders(pagination: IPagination, totalCount: number): IPaginationHeader {
    if (!pagination) {
      return;
    }

    const page = +pagination.page;
    const perPage = +pagination.perPage;
    const pagesCount = Math.ceil(totalCount / perPage);

    return {
      'x-page': page,
      'x-total-count': totalCount,
      'x-pages-count': pagesCount,
      'x-per-page': perPage,
      'x-next-page': page === pagesCount ? page : page + 1,
    };
  }
}

export const getHeaders = (pagination: IPagination, totalCount: number): IPaginationHeader => {
  if (!pagination) {
    return;
  }

  const page = +pagination.page;
  const perPage = +pagination.perPage;
  const pagesCount = Math.ceil(totalCount / perPage);

  return {
    'x-page': page,
    'x-total-count': totalCount,
    'x-pages-count': pagesCount,
    'x-per-page': perPage,
    'x-next-page': page === pagesCount ? page : page + 1,
  };
};

export const createPagination = (page: number, perPage: number): IPagination => {
  page = +page || 1;
  perPage = +perPage || 20;

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  return {
    page,
    perPage,
    startIndex,
    endIndex,
  };
};
