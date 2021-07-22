import React from 'react';
import { models, Report, Embed } from 'powerbi-client'
import { PowerBIEmbed } from 'powerbi-client-react';

const ReportCoverage: React.FC = () => {

  const embedUrl = "https://app.powerbi.com/rdlEmbed?reportId=a4a3f755-b45c-42b0-90cc-3eda887e0107&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUNBTkFEQS1DRU5UUkFMLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwiY2VydGlmaWVkVGVsZW1ldHJ5RW1iZWQiOnRydWUsInVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d&rp:paramCompanyId=2&rp:paramBU_Id:isnull=true"
  const reportAccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMDQ0ZWJhNWMtMjI1OC00MDMyLTlkNTgtNWIyYmZjZjNjMDBmLyIsImlhdCI6MTYyNjk1MjI3OCwibmJmIjoxNjI2OTUyMjc4LCJleHAiOjE2MjY5NTYxNzgsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUFlWlZHK2J3Rzk2TDZVK1ZaTFJ0RmoyWmYycFhjVzIwbko2T0hSTDZ0ckV2WkpEV1Noenp4dVpQZEtWNTV1NUJ5IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoiUGF0ZWwiLCJnaXZlbl9uYW1lIjoiVmlzaGFsIiwiaXBhZGRyIjoiMTQuOTkuMTAzLjE1NCIsIm5hbWUiOiJWaXNoYWwgUGF0ZWwiLCJvaWQiOiIzZTNlOWJlNC0zYjk4LTQ3ODYtYjRmNi1kNzk3NmY3ODA2MDIiLCJwdWlkIjoiMTAwMzIwMDE0QTI3OEYxNSIsInJoIjoiMC5BU2tBWExwT0JGZ2lNa0NkV0Zzcl9QUEFEdzhCSElkaFhyRlBnNnlZWVFwLWtSQXBBSUUuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiRGFvUVRmdWs2eDJKSVRobnZ6UkFrc2JWeW93bXRIV3RWemw5dW9DUkFXRSIsInRpZCI6IjA0NGViYTVjLTIyNTgtNDAzMi05ZDU4LTViMmJmY2YzYzAwZiIsInVuaXF1ZV9uYW1lIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXBuIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXRpIjoiZnpZZ2otVGhqRVN4dGwtYURrRUNBdyIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.FR4mI-Hn4ttWA4xSE5LikRWSeGMbcC_gc1wWWhQ9i2sXyQYLoUABsPAPbnYXdlnGaTaUccCYsoASQCJyTyVh5x50M8OZ-L16fBvrsiTSx8feTeH_TQsxtNWkJumE7a0cycsMOFyEUQTLa3Iq-EGAqmS-T42DqY9OkIRZw2sTGGz8C_4ISZtMYEoKLs5MC4nB0HFS3cdL5lgFZ4nDnF2r4xOLYDfjKTfHbscbaAkl9by9mEy3XYm-CYQqrz8miTvHDUf94ZpwaaQ3B3yiW-wThDWj60lNumxFmuKEgK4E7h7ORQ_ZLPd410aA31niM74U7ZlgmYTqS4UTOfWEuKzwEw";
  const reportId = "a4a3f755-b45c-42b0-90cc-3eda887e0107";
  let report: Report = null;

  const reportConfig: models.IReportEmbedConfiguration =
  {
    type: 'report',
    tokenType: models.TokenType.Aad,
    id: reportId,
    embedUrl: embedUrl,
    accessToken: reportAccessToken,
  };

  return (
    <div className="sqlServer">
      <div className="title-block">
        <h4 className="p-0">Coverage Report</h4>
      </div>
      <div className="main-card">
        {
          <PowerBIEmbed
            embedConfig={reportConfig}
            cssClassName={'report-style-class'}
            getEmbeddedComponent={async (embedObject: Embed) => {
              report = embedObject as Report;
            }}
          />
        }
      </div>
    </div>
  );
};

export default ReportCoverage;
