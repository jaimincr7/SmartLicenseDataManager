import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface ISqlServerProps {
  match?: match<IDetailParams>;
}
