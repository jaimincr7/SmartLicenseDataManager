import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface ISqlServerPricingProps {
  match?: match<IDetailParams>;
}
