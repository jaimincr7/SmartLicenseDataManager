import React from 'react';
import authService from '../../../services/auth/auth.service';
import { models, Embed, service } from 'powerbi-client'
import { PowerBIEmbed } from 'powerbi-client-react';

const ReportCoverage: React.FC = () => {

  const [accessToken, setAccessToken] = React.useState<string>('')

  React.useEffect(() => {
    authService.getAuthToken().then((a) => {
      setAccessToken(a as string);
    });
  }, [])

  const sampleReportConfig: models.IReportEmbedConfiguration =
  {
    type: 'report',
    tokenType: models.TokenType.Aad,
    id: "a4a3f755-b45c-42b0-90cc-3eda887e0107",
    embedUrl: "https://app.powerbi.com/rdlEmbed?reportId=a4a3f755-b45c-42b0-90cc-3eda887e0107&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUNBTkFEQS1DRU5UUkFMLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwiY2VydGlmaWVkVGVsZW1ldHJ5RW1iZWQiOnRydWUsInVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d",
    accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMDQ0ZWJhNWMtMjI1OC00MDMyLTlkNTgtNWIyYmZjZjNjMDBmLyIsImlhdCI6MTYyNjM0NTUxMiwibmJmIjoxNjI2MzQ1NTEyLCJleHAiOjE2MjYzNDk0MTIsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUFVTmZDVGtQaXdQMW1jbDlONU1KTEdyRFZ4cGluZDhOei8ybm5LZnFCMGNpMi9pUkZiTzR0NWwvbVVEeFhPd3crIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoiUGF0ZWwiLCJnaXZlbl9uYW1lIjoiVmlzaGFsIiwiaXBhZGRyIjoiMTQuOTkuMTAzLjE1NCIsIm5hbWUiOiJWaXNoYWwgUGF0ZWwiLCJvaWQiOiIzZTNlOWJlNC0zYjk4LTQ3ODYtYjRmNi1kNzk3NmY3ODA2MDIiLCJwdWlkIjoiMTAwMzIwMDE0QTI3OEYxNSIsInJoIjoiMC5BU2tBWExwT0JGZ2lNa0NkV0Zzcl9QUEFEdzhCSElkaFhyRlBnNnlZWVFwLWtSQXBBSUUuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiRGFvUVRmdWs2eDJKSVRobnZ6UkFrc2JWeW93bXRIV3RWemw5dW9DUkFXRSIsInRpZCI6IjA0NGViYTVjLTIyNTgtNDAzMi05ZDU4LTViMmJmY2YzYzAwZiIsInVuaXF1ZV9uYW1lIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXBuIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXRpIjoiOFJTSWJJSGJaa0dNWWktSk11UENBUSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.Q3GfeKDR7IWSf2iAlD_UCd0lBlPE8hOVz3USV-txRhc1gZpMe6uWDI4F14gjln76CSTkKgD0NfOdzRoi5lgXxIojWuiYajHx4K0GTM6o17Di7gGb-xrJlTecIz-S83F6snGX2zlDolIXESq4CEdK4KnCJtJPXy9ltgn2o-udfF3X_7tMNGnOIzLP5YjkBvaZSNLuHsh0dyc7aH4txTvsSnIEqt_9IaleB8nIpszFkyzwHMYdFu48hlFSGJb7divOQgsOyu4oBJHsmRwZwbCVY9r1jm_IBXuaFNJ6D8d-tixFVlVi2uOEv4Iep3wMdUOAt1xz3SZ5PFYIlIanTYwLsg"
  };

  const eventHandlersMap = new Map([
    ['loaded', function () {
      console.log('Report has loaded');
    }],
    ['rendered', function () {
      console.log('Report has rendered');
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
        <PowerBIEmbed
          embedConfig={sampleReportConfig}
          eventHandlers={eventHandlersMap}
          cssClassName={"report-style-class"}
          getEmbeddedComponent={(embedObject: Embed) => {
            console.log(embedObject);
          }}
        />
      </div>
    </div>
  );
};

export default ReportCoverage;
