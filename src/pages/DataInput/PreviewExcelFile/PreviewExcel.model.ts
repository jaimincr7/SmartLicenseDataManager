export interface IPreviewExcel {
  headerRowCount?: number;
  previewData: (val: string | number) => void;
  records: any;
  handleModalClose: () => void;
  showModal: boolean;
  maxCount: number;
}
