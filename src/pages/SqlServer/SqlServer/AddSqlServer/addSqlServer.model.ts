import { match } from 'react-router-dom';

export interface IDropDownOption {
  id: number;
  name: string;
}
interface IDetailParams {
  id: string;
}
export interface IAddSqlServerProps {
  id: number;
  showModal: boolean;
  handleModalClose: () => void;
  refreshDataTable: () => void;
}
