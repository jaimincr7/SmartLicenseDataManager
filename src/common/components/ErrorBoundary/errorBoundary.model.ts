import { IErrorLog } from '../../../store/errorLog/errorLog.model';

export interface IErrorBoundaryProps {
  addError: (data: IErrorLog) => void;
  children: React.ReactNode;
}

export interface IErrorBoundaryState {
  hasError: boolean;
}
