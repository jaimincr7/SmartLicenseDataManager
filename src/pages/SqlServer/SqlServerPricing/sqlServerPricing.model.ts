import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface ISqlServerPricingProps {
  match?: match<IDetailParams>;
}
