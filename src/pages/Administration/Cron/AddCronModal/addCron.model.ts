export interface IAddCronProps {
  id: number;
  showModal: boolean;
  isMultiple?: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  valuesForSelection?: any[];
  filterKeys?: any;
  setDropDownFlag?: (val: boolean) => void;
}
