export interface ICheckDelimeterProps {
  showModal?: boolean;
  handleModalClose: () => void;
  setDefaultDelimeter?: (data: any) => void;
  setRecords?: (data: any) => void;
  records?: any;
  tableName?: string;
}
