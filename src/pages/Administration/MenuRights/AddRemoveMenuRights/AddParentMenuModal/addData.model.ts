export interface IAddParentMenuModalProps {
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable?: () => void;
  tableName?: string;
}
