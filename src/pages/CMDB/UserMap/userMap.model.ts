import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface ICmdbUserMapProps {
  match?: match<IDetailParams>;
}
