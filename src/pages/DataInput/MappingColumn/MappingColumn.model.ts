export interface IMappingColumnProps {
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
