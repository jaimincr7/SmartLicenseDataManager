import React from 'react';
import RenderReport from '../RenderReport';

const ReportCoverage: React.FC = () => {
  // const [embeddedReport, setEmbeddedReport] = useState<Report>(null);
  return (
    <RenderReport
      reportName={'Coverage'}
      reportId={'a4a3f755-b45c-42b0-90cc-3eda887e0107'}
      // setEmbeddedReport={setEmbeddedReport}
    ></RenderReport>
  );
};

export default ReportCoverage;
