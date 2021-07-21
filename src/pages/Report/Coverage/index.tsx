import React from 'react';
import authService from '../../../services/auth/auth.service';
import { models, Report, Embed, service } from 'powerbi-client'
import { PowerBIEmbed } from 'powerbi-client-react';
import { powerBIFilterSchema } from '../../../common/constants/common';

const ReportCoverage: React.FC = () => {

  const [accessToken, setAccessToken] = React.useState<string>('');
  const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=5ee20bdf-4895-4a7e-baea-80cf14ac8dc0&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUNBTkFEQS1DRU5UUkFMLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwiY2VydGlmaWVkVGVsZW1ldHJ5RW1iZWQiOnRydWUsInVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d"';
  const reportAccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMDQ0ZWJhNWMtMjI1OC00MDMyLTlkNTgtNWIyYmZjZjNjMDBmLyIsImlhdCI6MTYyNjg1NDI1MywibmJmIjoxNjI2ODU0MjUzLCJleHAiOjE2MjY4NTgxNTMsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUFlbUFKMHJGeTFjczNJV29qS3A2MVhNTjVDcHQ3UXJ3TVRkY0JwN3pQMWF2ak8rdlBTaXlwUWRwcTJJcGVGaXZjIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoiUGF0ZWwiLCJnaXZlbl9uYW1lIjoiVmlzaGFsIiwiaXBhZGRyIjoiMTQuOTkuMTAzLjE1NCIsIm5hbWUiOiJWaXNoYWwgUGF0ZWwiLCJvaWQiOiIzZTNlOWJlNC0zYjk4LTQ3ODYtYjRmNi1kNzk3NmY3ODA2MDIiLCJwdWlkIjoiMTAwMzIwMDE0QTI3OEYxNSIsInJoIjoiMC5BU2tBWExwT0JGZ2lNa0NkV0Zzcl9QUEFEdzhCSElkaFhyRlBnNnlZWVFwLWtSQXBBSUUuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiRGFvUVRmdWs2eDJKSVRobnZ6UkFrc2JWeW93bXRIV3RWemw5dW9DUkFXRSIsInRpZCI6IjA0NGViYTVjLTIyNTgtNDAzMi05ZDU4LTViMmJmY2YzYzAwZiIsInVuaXF1ZV9uYW1lIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXBuIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXRpIjoieElTeUVKZTRMMEtnZjVOZzVEc3JBdyIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.dw7vCSJkhfMeaY1CprfQ-BAtCT0oltJzRv2uAAUJTJis8tqtaTKcyof5jbQflM2RSdahmSAcbflcGuvrTjKvJJeHq_KSDN5rw78uGzfw80U9bUMfubanV6V8wbuuHba-leyiJU4YaikOhN_7jh9cIRRLyAKr5O3ltcuQoBU_aeSVapvS2dKKP_VCuDZf0MWXTtf7_aYyXXtLgnGAd0caLdbc_1aOt7GkbWEqdnDVFw6KylzwInLgqkJi1bjiYqLJpBHE3L8fVf6OFiV0e_7BuqBoYRXRPw0Yb0aWiPCUxZvuwxoV_sTSIZr7OxwWUy6XCf11N9l4Wv_vd_I7p0UQBw';
  const reportId = "5ee20bdf-4895-4a7e-baea-80cf14ac8dc0";
  const defaultFilterValue = ["VBP1"];
  let report: Report = null;

  React.useEffect(() => {
    authService.getAuthToken().then((a) => {
      setAccessToken(a as string);
    });
  }, []);

  const reportConfig: models.IReportEmbedConfiguration =
  {
    type: 'report',
    tokenType: models.TokenType.Aad,
    id: reportId,
    embedUrl: embedUrl,
    accessToken: reportAccessToken
  };

  const setDefaultFilters = async (columnName: string) => {
    const pages = await report.getPages();
    const activePage = pages.filter(function (page) {
      return page.isActive;
    })[0];
    const visuals = await activePage.getVisuals();
    const defaultLayout = {
      displayState: {
        mode: models.VisualContainerDisplayMode.Visible
      }
    };

    visuals?.forEach(async visual => {
      if (visual.type === "slicer") {
        const slicerState: any = await visual.getSlicerState();
        const slicer = slicerState.targets.find(x => x.column === columnName);
        if (slicer) {
          const filter: any = {
            $schema: powerBIFilterSchema.Basic,
            target: {
              table: slicer.table,
              column: slicer.column
            },
            filterType: models.FilterType.Basic,
            operator: "In",
            values: defaultFilterValue
          };
          await visual.setSlicerState({ filters: [filter] });

          const pageLayout = {
            defaultLayout: defaultLayout,
            visualsLayout: {
              [visual.name]: {
                displayState: {
                  mode: models.VisualContainerDisplayMode.Visible,
                }
              },
            }
          };

          const settings = {
            layoutType: models.LayoutType.Custom,
            customLayout: {
              displayOption: models.DisplayOption.FitToPage,
              pagesLayout: {
                [visual.page.name]: pageLayout
              }
            }
          }
          try {
            await report.updateSettings(settings);
          }
          catch (error) {
            console.log(error);
          }
        }
      }
    });
  }

  const eventHandlersMap = new Map([
    ['loaded', function () {
      if (report) {
        setDefaultFilters("BU Name");
      }
    }],
    ['rendered', async () => {
      console.log('Report has loaded');
    }],
    ['error', function (event?: service.ICustomEvent<any>) {
      if (event) {
        console.error(event.detail);
      }
    }]
  ]);

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">Coverage Report</h4>
      </div>
      <div className="main-card">
        {accessToken && <PowerBIEmbed
          embedConfig={reportConfig}
          eventHandlers={eventHandlersMap}
          cssClassName={'report-style-class'}
          getEmbeddedComponent={(embedObject: Embed) => {
            report = embedObject as Report;
          }}
        />}
      </div>
    </div>
  );
};

export default ReportCoverage;
