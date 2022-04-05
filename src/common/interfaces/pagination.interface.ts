export interface Pagination<T> {
  items: T[];
  meta: {
    itemsCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    last: string;
    next: string;
    previous: string;
  };
}
