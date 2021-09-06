import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface IConfigComponentProps {
  match?: match<IDetailParams>;
}
