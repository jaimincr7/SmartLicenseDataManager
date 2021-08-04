import { match } from 'react-router-dom';
import { IReportParams } from './../../../common/models/common';

export interface IRenderReportProps {
  match?: match<IReportParams>;
}
