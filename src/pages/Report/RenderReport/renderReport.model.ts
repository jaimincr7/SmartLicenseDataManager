import { Report } from 'powerbi-client';

export interface IRenderReportProps {
  reportName: string;
  reportId: string;
  setEmbeddedReport?: (report: Report)=> void;
  groupId?: string;
}
