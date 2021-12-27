export interface IAddSpsApiInjectionParamV2Props {
  id: number;
  showModal: boolean;
  isMultiple?: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
  valuesForSelection?: any[];
  typeId?: number;
}
