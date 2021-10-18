export interface ICallApiModalProps {
  params: { [key: string]: any };
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  onCallApi: (values: any) => void;
}
