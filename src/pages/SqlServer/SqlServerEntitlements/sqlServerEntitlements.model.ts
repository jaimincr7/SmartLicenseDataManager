import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface ISqlServerEntitlementsProps {
  match?: match<IDetailParams>;
}
