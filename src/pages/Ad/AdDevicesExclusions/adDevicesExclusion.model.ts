import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IAdDevicesExclusionsProps {
  match?: match<IDetailParams>;
}
