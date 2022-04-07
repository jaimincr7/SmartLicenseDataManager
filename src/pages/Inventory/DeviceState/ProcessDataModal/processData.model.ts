export interface IProcessDataModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  filterKeys?: any;
  tableName?: string;
}
