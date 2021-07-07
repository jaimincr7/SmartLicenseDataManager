import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IWindowsServerPricingProps {
  match?: match<IDetailParams>;
}
