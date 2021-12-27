import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface ISpsApiTokenConfigOptionsV2Props {
  match?: match<IDetailParams>;
  isTabbed?: boolean;
  typeId?: number;
}
