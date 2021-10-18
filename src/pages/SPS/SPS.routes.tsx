import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import SpsApiGroup from './ApiGroup';
import SpsApiOauth from './ApiOauth';
import SPSAPI from './APIs/index';
import SPSAPIsCall from './APIsCall';
import SpsApiTokenConfigOptions from './ApiTokenConfigOptions';
import SpsApiType from './ApiType';
import SpsApiJobs from './SpsApiJobs';
import SpsApiJobsData from './SpsApiJobsData';

const SPSRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* APIs */}
        {ability.can(Action.View, Page.SPSApi) && (
          <Route exact path={`${match.path}/sps-api`} component={SPSAPI} />
        )}
        {ability.can(Action.View, Page.SPSApi) && (
          <Route exact path={`${match.path}/sps-api/:id`} component={SPSAPI} />
        )}

        {/* Call APIs */}
        {ability.can(Action.View, Page.SPSApiCall) &&  (
          <Route exact path={`${match.path}/sps-config-api`} component={SPSAPIsCall} />
        )}

        {/* SPS API Jobs */}
        {ability.can(Action.View, Page.SpsApiJobs) && (
          <Route exact path={`${match.path}/sps-api-jobs`} component={SpsApiJobs} />
        )}
        {ability.can(Action.View, Page.SpsApiJobs) && (
          <Route exact path={`${match.path}/sps-api-jobs/:id`} component={SpsApiJobs} />
        )}

        {/* SPS API Group */}
        {ability.can(Action.View, Page.SpsApiGroup) && (
          <Route exact path={`${match.path}/sps-api-group`} component={SpsApiGroup} />
        )}
        {ability.can(Action.View, Page.SpsApiGroup) && (
          <Route exact path={`${match.path}/sps-api-group/:id`} component={SpsApiGroup} />
        )}

        {/* SPS API Type */}
        {ability.can(Action.View, Page.SpsApiType) && (
          <Route exact path={`${match.path}/sps-api-type`} component={SpsApiType} />
        )}
        {ability.can(Action.View, Page.SpsApiType) && (
          <Route exact path={`${match.path}/sps-api-type/:id`} component={SpsApiType} />
        )}

        {/* SPS API Oauth */}
        {ability.can(Action.View, Page.SpsApiOauth) && (
          <Route exact path={`${match.path}/sps-api-oauth`} component={SpsApiOauth} />
        )}
        {ability.can(Action.View, Page.SpsApiOauth) && (
          <Route exact path={`${match.path}/sps-api-oauth/:id`} component={SpsApiOauth} />
        )}

        {/* SPS API TokenConfigOptions */}
        {ability.can(Action.View, Page.SpsApiTokenConfigOptions) && (
          <Route
            exact
            path={`${match.path}/sps-api-token-config-options`}
            component={SpsApiTokenConfigOptions}
          />
        )}
        {ability.can(Action.View, Page.SpsApiTokenConfigOptions) && (
          <Route
            exact
            path={`${match.path}/sps-api-token-config-options/:id`}
            component={SpsApiTokenConfigOptions}
          />
        )}

        {/* SPS API Jobs Data */}
        {ability.can(Action.View, Page.SpsApiJobsData) && (
          <Route exact path={`${match.path}/sps-api-jobs-data/:id`} component={SpsApiJobsData} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default SPSRoutes;
