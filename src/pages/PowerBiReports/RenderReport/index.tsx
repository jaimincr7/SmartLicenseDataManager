import React, { useEffect, useState } from 'react';
import { IRenderReportProps } from './renderReport.model';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report, Embed } from 'powerbi-client';
import configurationService from '../../../services/powerBiReports/configuration/configuration.service';
import { Spin } from 'antd';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const RenderReport: React.FC<IRenderReportProps> = (props) => {
  const { match } = props;
  const [embeddedReport, setEmbeddedReport] = useState<Report>(null);
  const [height, setHeight] = useState<string>('500px');

  const [reportConfig, setReportConfig] = useState({
    type: 'report',
    tokenType: models.TokenType.Embed,
    id: '',
    embedUrl: '',
    accessToken: '',
  });

  const updateHeight = () => {
    const header = document.querySelector('.header')?.clientHeight;
    const title = document.querySelector('.title-block')?.clientHeight;
    const totalHeight = document.body.clientHeight;
    const finalHeight = totalHeight - header - title - 75 - 5;
    setHeight(`${finalHeight}px`);
  };

  const { name } = match.params;
  useEffect(() => {
    setReportConfig({ ...reportConfig, id: '' });
    configurationService.getReportDetail(name).then((res) => {
      if (res && res.body?.data) {
        const reportDetail = res.body.data;
        setReportConfig({
          ...reportConfig,
          id: reportDetail.pb_report_id,
          embedUrl: reportDetail.embedded_url,
          accessToken: reportDetail.access_token,
        });
        embeddedReport?.refresh();
        updateHeight();
      }
    });
  }, [match.params]);

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={name} />
        </h4>
      </div>
      <div className="main-card">
        {reportConfig.id ? (
          <div style={{ height: height }}>
            <PowerBIEmbed
              embedConfig={reportConfig}
              cssClassName={'report-style-class'}
              getEmbeddedComponent={async (embedObject: Embed) => {
                setEmbeddedReport(embedObject as Report);
              }}
            />
          </div>
        ) : (
          <Spin />
        )}
      </div>
    </div>
  );
};

export default RenderReport;
