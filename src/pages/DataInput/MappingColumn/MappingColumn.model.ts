export interface IMappingColumnProps {
  saveMapping: (fileName: string, isPublic: boolean) => void;
  fileName: string;
  fileType: string;
  skipRows: number;
  sheetName: string;
  tableName?:  string;
  seqNumber?:  number;
  onExcelMapping?: (values: any) => void;
}
