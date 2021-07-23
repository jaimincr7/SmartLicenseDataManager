import React from 'react'
import { IRenderReportProps } from './renderReport.model';
import { PowerBIEmbed } from 'powerbi-client-react';
import {  models, Report, Embed } from 'powerbi-client';

const RenderReport: React.FC<IRenderReportProps> = (props) => {

  const embedUrl = `https://app.powerbi.com/rdlEmbed?reportId=a4a3f755-b45c-42b0-90cc-3eda887e0107&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUNBTkFEQS1DRU5UUkFMLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwiY2VydGlmaWVkVGVsZW1ldHJ5RW1iZWQiOnRydWUsInVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d&rp:paramCompanyId=2&rp:paramBU_Id:isnull=true`; // add &rdl:parameterPanel=hidden to make parameter panel hidden
  const reportAccessToken ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMDQ0ZWJhNWMtMjI1OC00MDMyLTlkNTgtNWIyYmZjZjNjMDBmLyIsImlhdCI6MTYyNzAxODk1MiwibmJmIjoxNjI3MDE4OTUyLCJleHAiOjE2MjcwMjI4NTIsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUF1ZTdRcEpZWkJ5ZjlmL2NvYkFhRmhiSFNpcE5PTkliVEg0a0l2Und3OXdJTlhaRlB5Qi9lOFlDeXNOZ3Nsa3pNIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoiUGF0ZWwiLCJnaXZlbl9uYW1lIjoiVmlzaGFsIiwiaXBhZGRyIjoiMTQuOTkuMTAzLjE1NCIsIm5hbWUiOiJWaXNoYWwgUGF0ZWwiLCJvaWQiOiIzZTNlOWJlNC0zYjk4LTQ3ODYtYjRmNi1kNzk3NmY3ODA2MDIiLCJwdWlkIjoiMTAwMzIwMDE0QTI3OEYxNSIsInJoIjoiMC5BU2tBWExwT0JGZ2lNa0NkV0Zzcl9QUEFEdzhCSElkaFhyRlBnNnlZWVFwLWtSQXBBSUUuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiRGFvUVRmdWs2eDJKSVRobnZ6UkFrc2JWeW93bXRIV3RWemw5dW9DUkFXRSIsInRpZCI6IjA0NGViYTVjLTIyNTgtNDAzMi05ZDU4LTViMmJmY2YzYzAwZiIsInVuaXF1ZV9uYW1lIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXBuIjoidmlzaGFsLnBhdGVsQG1ldHJpeGRhdGEzNjAuY29tIiwidXRpIjoiNWU0NGFOaHNDa3VWenRKRkhDeEFBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.TW3eQv2_Uz967UE-DzZHcUYjLoTiQAUFm0DWLFCV6t7gno69nZKP_e0FgBFrvm3EaRVPIVbGGfDuRAE9PW4LVKj2dEjnngsUqqtHkKQPuoplKtJIWB0FfjXRUJdvw3e2a_lpmRHCD2jusmLRZIq2TAq2gvsb9lmWx57ABlfRS9h_KV2jOt0AEkXs0XAQEjIt7Y5JGWM53ZhUzVPTod1ITbLBoAtlJ0C6V8E2JE1Eqp9QRq30Uw26MsfQ-0y_ARjbtxi68jk0ghtRkhkZB56tlS9jCqTV8pQ9gPLTKKcpEcbperlhTGzANafqnpsvhqJHj14fwNtQ8VIwYLRCkRzaSg"

  const reportConfig: models.IReportEmbedConfiguration = {
    type: 'report',
    tokenType: models.TokenType.Aad,
    id:  props.reportId,
    embedUrl: embedUrl,
    accessToken: reportAccessToken,
  };

  return (
    <div className="sqlServer">
    <div className="title-block">
      <h4 className="p-0">{props.reportName} Report</h4>
    </div>
    <div className="main-card">
      {
        <PowerBIEmbed
          embedConfig={reportConfig}
          cssClassName={'report-style-class'}
          getEmbeddedComponent={async (embedObject: Embed) => {
            props.setEmbeddedReport(embedObject as Report);
          }}
        />
      }
    </div>
  </div>
  )
}

export default RenderReport
