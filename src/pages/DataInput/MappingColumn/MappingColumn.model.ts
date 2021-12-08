export interface IMappingColumnProps {
  saveMapping: (fileName: string, isPublic: boolean) => void;
  fileName: string;
  fileType: string;
  showModal: boolean;
  handleModalClose?: () => void;
  tableName?:  string;
  excelColumns?:  any[];
  onExcelMapping?: (values: any) => void;
}
