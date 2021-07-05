export interface IDeleteDatasetModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  tableName: string;
}
