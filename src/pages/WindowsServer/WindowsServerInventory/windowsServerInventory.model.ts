import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IWindowsServerInventoryProps {
  match?: match<IDetailParams>;
}
