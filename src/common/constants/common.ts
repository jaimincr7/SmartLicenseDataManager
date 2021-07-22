import { IDropDownOption } from './../models/common';

export const Common = {
  DATEFORMAT: 'yyyy-MM-DD',
};

export const DEFAULT_PAGE_SIZE = 10;

export const booleanLookup: IDropDownOption[] = [
  { id: 0, name: 'No' },
  { id: 1, name: 'Yes' },
];

export const exportExcel = (fileName: string, url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  link.remove();
};

