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
  count: { [key: string]: number };
  setDateChangeFlag?: (value: boolean) => void;
  setFlagForMappingHighlights?:(value: boolean) => void;
  flagForMappingHighlights?: boolean;
}
