import { ISearch } from '../../../common/models/common';

export interface IConfiguration {
  id?: number;
  name: string;
  description: string;
  embedded_url: string;
  pb_report_id: string;
  work_space_id: string;
}

export interface ISearchConfiguration extends ISearch {}

export interface IReportEmbedUrl {
  pb_report_id: string;
  work_space_id: string;
}
