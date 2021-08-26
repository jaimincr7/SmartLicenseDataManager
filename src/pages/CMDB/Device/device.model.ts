import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface ICmdbDeviceProps {
  match?: match<IDetailParams>;
}
