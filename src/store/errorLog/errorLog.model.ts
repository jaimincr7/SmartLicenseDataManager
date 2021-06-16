import { ErrorInfo } from 'react';

export interface IErrorLog {
  err: string;
  info: ErrorInfo | string;
}

export interface IErrorLogState {
  errors: IErrorLog[];
}
