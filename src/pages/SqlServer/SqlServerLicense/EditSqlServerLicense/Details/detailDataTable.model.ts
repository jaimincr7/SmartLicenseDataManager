export interface IDetailDataTableProps {
  licenseId: number;
}

export type fixedColumn = 'right' | 'left';

export interface IInlineSearch {
  [key: string]: string | string[] | number[];
}
