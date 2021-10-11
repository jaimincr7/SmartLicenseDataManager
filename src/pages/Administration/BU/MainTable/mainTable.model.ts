export interface IMainTable {
  isMultiple?: boolean;
  setSelectedId: (id: number) => void;
  setShowSelectedListModal: (show: boolean) => void;
  setValuesForSelection: (val: any) => void;
}
