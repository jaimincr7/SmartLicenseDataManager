export type orderByType = 'ASC' | 'DESC';

export interface ISearch {
  limit?: number;
  offset?: number;
  order_by?: string;
  order_direction?: orderByType;
  keyword?: string;
}

export interface IApiResponseBody<T> {
  data?: T;
  messages?: string[];
  errors?: string[];
}

export interface IApiResponse<T> {
  status: number;
  body: IApiResponseBody<T>;
}

export interface ISearchResult<T> {
  records: T[];
  total_count: number;
}

export interface ISearchResponse<T> {
  search_result: ISearchResult<T>;
}
