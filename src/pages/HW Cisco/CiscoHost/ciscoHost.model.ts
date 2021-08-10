import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface ICiscoHostProps {
  match?: match<IDetailParams>;
}
