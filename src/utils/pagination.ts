export const defaultPagination = {
  page: 1,
  itemsPerPage: 20,
  totalItems: 0,
  totalPages: 0,
}

export type FePagination = {
  sortBy?: string;
  descending?: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
};

