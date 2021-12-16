export interface ICheckDelimeterProps {
  showModal?: boolean;
  handleModalClose: () => void;
  setRecords?: (data: any) => void;
  records?: any;
  tableName?: string;
}
