export interface IApiTableProps {
  type_id?: number;
  showModal?: boolean;
  handleModalClose: () => void;
  callApiObj?: any;
  isFetchApi?: boolean;
}
