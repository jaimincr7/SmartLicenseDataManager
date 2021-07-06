import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IWindowsServerOverridesProps {
  match?: match<IDetailParams>;
}
