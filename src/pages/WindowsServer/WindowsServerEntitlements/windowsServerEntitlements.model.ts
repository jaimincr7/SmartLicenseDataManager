import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IWindowsServerEntitlementsProps {
  match?: match<IDetailParams>;
}
