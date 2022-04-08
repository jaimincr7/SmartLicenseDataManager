import React, { useEffect, useState } from 'react';
import { IRenderReportProps } from './renderReport.model';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report, Embed } from 'powerbi-client';
import configurationService from '../../../services/powerBiReports/configuration/configuration.service';
import { Spin } from 'antd';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { useAppSelector } from '../../../store/app.hooks';
import { globalSearchSelector } from '../../../store/globalSearch/globalSearch.reducer';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';

const RenderReport: React.FC<IRenderReportProps> = (props) => {
  const globalFilters = useAppSelector(globalSearchSelector);
  const { match } = props;
  const [embeddedReport, setEmbeddedReport] = useState<Report>(null);
  const [height, setHeight] = useState<string>('500px');
  const [embedUrlString, setEmbedUrlString] = useState('');

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

  const setString = (url: string) => {
    const signal = url.includes('?') ? '&' : '?';

    if (globalFilters.search.tenant_id && globalFilters.search.tenant_id !== 0) {
      if (globalFilters.search.company_id && globalFilters.search.company_id !== 0) {
        if (globalFilters.search.bu_id && globalFilters.search.bu_id !== 0) {
          return (
            signal +
            `rp:paramTenantId=${globalFilters.search.tenant_id}` +
            `&rp:paramCompanyId=${globalFilters.search.company_id}` +
            `&rp:paramBU_Id=${globalFilters.search.bu_id}`
          );
        }
        return (
          signal +
          `rp:paramTenantId=${globalFilters.search.tenant_id}` +
          `&rp:paramCompanyId=${globalFilters.search.company_id}`
        );
      }
      return signal + `rp:paramTenantId=${globalFilters.search.tenant_id}`;
    }
  };

  const configure = () => {
    setReportConfig({ ...reportConfig, id: '' });
    configurationService.getReportDetail(name).then(async (res) => {
      if (res && res.body?.data) {
        const reportDetail = res.body.data;
        const str = setString(reportDetail.embedded_url);
        setEmbedUrlString(reportDetail.embedded_url);
        setReportConfig({
          ...reportConfig,
          id: reportDetail.pb_report_id,
          embedUrl: reportDetail.embedded_url + str,
          accessToken: reportDetail.access_token,
        });
        embeddedReport?.refresh();
        updateHeight();
      }
    });
  };

  const { name } = match.params;
  useEffect(() => {
    configure();
  }, [match.params]);

  useEffect(() => {
    if (reportConfig.embedUrl && reportConfig.id) {
      const string = setString(embedUrlString);
      setReportConfig({ ...reportConfig, embedUrl: '' });
      setTimeout(() => {
        setReportConfig({ ...reportConfig, embedUrl: embedUrlString + string });
      }, 200);
    }
  }, [globalFilters.search]);

  const eventHandlersMap = new Map([
    [
      'error',
      function () {
        configure();
      },
    ],
  ]);

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={name} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        {reportConfig.embedUrl && reportConfig.id ? (
          <div style={{ height: height }}>
            <PowerBIEmbed
              embedConfig={reportConfig}
              eventHandlers={eventHandlersMap}
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
