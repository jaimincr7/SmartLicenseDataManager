import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IEditSqlServerLicenseProps {
  match?: match<IDetailParams>;
}
