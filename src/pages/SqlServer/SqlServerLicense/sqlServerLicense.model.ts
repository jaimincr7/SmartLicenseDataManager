import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface ISqlServerLicenseProps {
  match?: match<IDetailParams>;
}
