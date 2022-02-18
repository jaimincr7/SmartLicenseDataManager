export interface IMappingColumnProps {
  fileName: string;
  fileType: string;
  skipRows: number;
  tableName?: string;
  seqNumber?: number;
  record?: any;
  records?: any;
  is_public?: boolean;
  setRecords?: (data: any) => void;
  onExcelMapping?: (values: any) => void;
  dateChangeFlag?: boolean;
  setDateChangeFlag?: (value: boolean) => void;
}
