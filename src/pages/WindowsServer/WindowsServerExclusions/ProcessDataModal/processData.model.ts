export interface IProcessDataModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  tableName?: string;
}
