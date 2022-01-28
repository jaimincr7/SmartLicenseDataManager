import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface IHardwareProps {
  match?: match<IDetailParams>;
}
