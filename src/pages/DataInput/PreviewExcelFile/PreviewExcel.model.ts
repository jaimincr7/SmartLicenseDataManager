export interface IPreviewExcel {
  headerRowCount?: number;
  previewData: (val: string | number) => void;
  records: any;
  handleModalClose: () => void;
  showModal: boolean;
  dataRecords?: any;
  setRecords?: (data: any) => void;
  setDelimitFlag?: (data: any) => void;
  maxCount: number;
  seqNumber?: number;
}
