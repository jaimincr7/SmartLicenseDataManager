import { match } from 'react-router-dom';
import { IDetailParams } from '../../../common/models/common';

export interface ICmdbSoftwareProps {
  match?: match<IDetailParams>;
}
