export interface IAddCiscoPolicyProps {
  id: number;
  showModal: boolean;
  isMultiple?: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  valuesForSelection?: any[];
}
