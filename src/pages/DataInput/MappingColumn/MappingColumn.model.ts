export interface IMappingColumnProps {
  saveMapping: (fileName: string, isPublic: boolean) => void;
  fileName: string;
  fileType: string;
  showModal: boolean;
  handleModalClose: () => void;
  tableColumns?:  any[];
  excelColumns?:  any[];
  onExcelMapping?: (values: any) => void;
}
