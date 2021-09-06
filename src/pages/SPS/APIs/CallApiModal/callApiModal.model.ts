export interface ICallApiModalProps {
  id: number;
  params: { [key: string]: any };
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
