export interface IStartApiModalProps {
  // params: { [key: string]: any };
  showModal: boolean;
  // handleModalClose: () => void;
  refreshDataTable: () => void;
  // onStartApi: (values: any) => void;
  startTime: boolean;
  setShowApi: (values: any) => void;
  id?: number;
  queryParams?: { [key: string]: any };
  frequency?: number;
}
