export interface IMappingColumnProps {
  saveMapping: (fileName: string, isPublic: boolean) => void;
  fileName: string;
  fileType: string;
  skipRows: number;
  sheetName: string;
  tableName?:  string;
  seqNumber?:  number;
  setRecords?: (data: any) => void;
  onExcelMapping?: (values: any) => void;
}
