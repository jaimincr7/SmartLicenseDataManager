export interface ICallApiModalProps {
  params: { [key: string]: any };
  showModal: boolean;
  id?: number;
  bu_id?: number;
  company_id?: number;
  tenant_id?: number;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  onCallApi: (values: any) => void;
}
