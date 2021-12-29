export type orderByType = 'ASC' | 'DESC';

export interface ISearch {
  limit?: number;
  offset?: number;
  order_by?: string;
  order_direction?: orderByType;
  keyword?: string;
  filter_keys?: any;
  is_export_to_excel?: boolean;
  is_column_selection?: boolean;
  is_lookup?: boolean;
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

export interface ITableColumnSelection {
  id?: number;
  table_name?: string;
  columns?: { [key: string]: boolean };
  column_orders?: { [key: string]: boolean };
}

export interface ISearchResult<T> {
  records: T[];
  total_count: number;
  table_name?: any;
  column_selection?: ITableColumnSelection;
}

export interface ISearchResponse<T> {
  search_result: ISearchResult<T>;
}

export interface IDropDownOption {
  id: number;
  name: string;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[] | { [key: string]: any };
}

export interface IDetailParams {
  id: string;
}

export interface IReportParams {
  name: string;
}

export interface IMainTable {
  isMultiple?: boolean;
  setSelectedId?: (id: number) => void;
  setShowSelectedListModal?: (show: boolean) => void;
  setValuesForSelection?: (val: any) => void;
  setNumberOfRecords?: (val: any) => void;
  setFilterKeys?: (val: any) => void;
  tableButtons?: () => JSX.Element;

  //For Only Tabbed SPS Part
  isTabbed?: boolean;
  anyId?: number;
  addModalVisible?: boolean;
  setAddModalVisible?: (value: boolean) => void;
}
