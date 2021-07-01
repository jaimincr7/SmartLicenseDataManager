import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IAdUsersProps {
  match?: match<IDetailParams>;
}
