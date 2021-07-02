import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface ISqlServerOverridesProps {
  match?: match<IDetailParams>;
}
