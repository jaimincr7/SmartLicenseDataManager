export interface IDeleteDatasetModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable?: () => void;
  tableName: string;
  isDateAvailable?: boolean;
  filterKeys?: any;
  isDeleteDataSet?: boolean;
}
