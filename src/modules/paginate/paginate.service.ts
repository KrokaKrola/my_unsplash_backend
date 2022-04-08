import { Injectable } from '@nestjs/common';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';

export interface ObjectLiteral {
  [s: string]: any;
}

export interface IPaginationMeta extends ObjectLiteral {
  /**
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems?: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages?: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;

  /**
   * flag for "previous" page
   */
  hasPrevious?: boolean;
  /**
   * flag for "next" page
   */
  hasNext?: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

@Injectable()
export class PaginateService {
  generateMeta(
    paginationParams: PaginationParamsDto,
    total: number,
    currentPageItems: number,
  ): IPaginationMeta {
    const page = +paginationParams.page ?? 1,
      limit = +paginationParams.limit ?? 10;
    return {
      currentPage: page,
      itemCount: currentPageItems,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrevious: page > 1,
    };
  }

  generateFindManyParams(paginationParams: PaginationParamsDto) {
    const page = +paginationParams.page ?? 1,
      limit = +paginationParams.limit ?? 10;

    return {
      take: limit,
      skip: page * limit - limit,
    };
  }

  process<T = ObjectLiteral>(
    items: T[],
    paginationParams: PaginationParamsDto,
    total: number,
  ): IPaginatedResponse<T> {
    return {
      data: items,
      meta: this.generateMeta(paginationParams, total, items.length),
    };
  }
}
