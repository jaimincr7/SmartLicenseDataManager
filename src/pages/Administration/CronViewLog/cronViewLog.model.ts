import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface ICronViewLogProps {
  match?: match<IDetailParams>;
}
