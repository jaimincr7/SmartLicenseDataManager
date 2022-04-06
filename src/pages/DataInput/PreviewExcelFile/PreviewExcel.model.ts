export interface IPreviewExcel {
  headerRowCount?: number;
  previewData: (flag: boolean, val: string | number) => void;
  records: any;
  handleModalClose: () => void;
  showModal: boolean;
  dataRecords?: any;
  setRecords?: (data: any) => void;
  setDelimitFlag?: (data: any) => void;
  setExcelPreviewData?: (data: any) => void;
  maxCount: number;
  maxColumn: number;
  seqNumber?: number;
  firstFlag?: boolean;
  setFirstFlag?: (data: boolean) => void;
  setFlagForMappingHighlights?: (data: boolean) => void;
}
