import { match } from 'react-router-dom';

interface IDetailParams {
  id: string;
}

export interface IAdDevicesProps {
  match?: match<IDetailParams>;
}
