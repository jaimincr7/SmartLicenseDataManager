export interface IMappingColumnProps {
  saveMapping: (fileName: string, isPublic: boolean) => void;
  fileName: string;
  fileType: string;
  skipRows: number;
  tableName?:  string;
  seqNumber?:  number;
  record?: any;
  records?: any;
  setRecords?: (data: any) => void;
  onExcelMapping?: (values: any) => void;
}
