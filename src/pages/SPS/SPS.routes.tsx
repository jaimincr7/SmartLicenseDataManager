import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import SpsApiBaseUrl from './ApiBaseUrl';
import SpsApiGroup from './ApiGroup';
import SpsApiInjectionParamV2 from './ApiInjectionParamV2';
import SpsApiInjectionValueParamV2 from './ApiInjectionValueParamV2';
import SpsApiOauth from './ApiOauth';
import SpsApiOauthIdUrlInjectionSite from './ApiOauthIdUrlInjectionSite';
import SpsApiOauthUrlInjectionSite from './ApiOauthUrlInjectionSite';
import SpsApiOauthV2 from './ApiOauthV2';
import SPSAPI from './APIs/index';
import SPSAPIsCall from './APIsCall';
import SpsApiTokenConfigOptions from './ApiTokenConfigOptions';
import SpsApiTokenConfigOptionsV2 from './ApiTokenConfigOptionsV2';
import SpsApiType from './ApiType';
import SpsApiJobs from './SpsApiJobs';
import SpsApiJobsData from './SpsApiJobsData';
import TabforCRUDs from './TabforCRUDs';

const SPSRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* APIs */}
        {ability.can(Action.View, Page.SPSApi) && (
          <Route exact path={`${match.path}/sps-config-api`} component={SPSAPI} />
        )}
        {ability.can(Action.View, Page.SPSApi) && (
          <Route exact path={`${match.path}/sps-config-api/:id`} component={SPSAPI} />
        )}

        {/* Call APIs */}
        {ability.can(Action.View, Page.SPSApiCall) && (
          <Route exact path={`${match.path}/sps-api`} component={SPSAPIsCall} />
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

        {/* SPS API Base Url */}
        {ability.can(Action.View, Page.SpsApiBaseUrl) && (
          <Route exact path={`${match.path}/sps-api-base-url`} component={SpsApiBaseUrl} />
        )}
        {ability.can(Action.View, Page.SpsApiBaseUrl) && (
          <Route exact path={`${match.path}/sps-api-base-url/:id`} component={SpsApiBaseUrl} />
        )}

        {/* SPS API Oauth Url */}
        {ability.can(Action.View, Page.SpsApiOauthUrlInjectionSite) && (
          <Route
            exact
            path={`${match.path}/sps-api-oauth-url-injection-site`}
            component={SpsApiOauthUrlInjectionSite}
          />
        )}
        {ability.can(Action.View, Page.SpsApiOauthUrlInjectionSite) && (
          <Route
            exact
            path={`${match.path}/sps-api-oauth-url-injection-site/:id`}
            component={SpsApiOauthUrlInjectionSite}
          />
        )}

        {/* SPS API Oauth ID Url Injection Site */}
        {ability.can(Action.View, Page.SpsApiOauthIdUrlInjectionSite) && (
          <Route
            exact
            path={`${match.path}/sps-api-oauth-id-url-injection-site`}
            component={SpsApiOauthIdUrlInjectionSite}
          />
        )}
        {ability.can(Action.View, Page.SpsApiOauthIdUrlInjectionSite) && (
          <Route
            exact
            path={`${match.path}/sps-api-oauth-id-url-injection-site/:id`}
            component={SpsApiOauthIdUrlInjectionSite}
          />
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

        {/* SPS API TokenConfigOptionsV2 */}
        {ability.can(Action.View, Page.SpsApiTokenConfigOptionsV2) && (
          <Route
            exact
            path={`${match.path}/sps-api-token-config-options-v2`}
            component={SpsApiTokenConfigOptionsV2}
          />
        )}
        {ability.can(Action.View, Page.SpsApiTokenConfigOptionsV2) && (
          <Route
            exact
            path={`${match.path}/sps-api-token-config-options-v2/:id`}
            component={SpsApiTokenConfigOptionsV2}
          />
        )}

        {/* SPS API InjectionParamV2 */}
        {ability.can(Action.View, Page.SpsApiInjectionParamV2) && (
          <Route
            exact
            path={`${match.path}/sps-api-injection-param-v2`}
            component={SpsApiInjectionParamV2}
          />
        )}
        {ability.can(Action.View, Page.SpsApiInjectionParamV2) && (
          <Route
            exact
            path={`${match.path}/sps-api-injection-param-v2/:id`}
            component={SpsApiInjectionParamV2}
          />
        )}

        {/* SPS API InjectionValueParamV2 */}
        {ability.can(Action.View, Page.SpsApiInjectionValueParamV2) && (
          <Route
            exact
            path={`${match.path}/sps-api-injection-value-v2`}
            component={SpsApiInjectionValueParamV2}
          />
        )}
        {ability.can(Action.View, Page.SpsApiInjectionValueParamV2) && (
          <Route
            exact
            path={`${match.path}/sps-api-injection-value-v2/:id`}
            component={SpsApiInjectionValueParamV2}
          />
        )}

        {/* SPS API OauthV2 */}
        {ability.can(Action.View, Page.SpsApiOauthV2) && (
          <Route exact path={`${match.path}/sps-api-oauth-v2`} component={SpsApiOauthV2} />
        )}
        {ability.can(Action.View, Page.SpsApiOauthV2) && (
          <Route exact path={`${match.path}/sps-api-oauth-v2/:id`} component={SpsApiOauthV2} />
        )}

        {/* SPS API Jobs Data */}
        {ability.can(Action.View, Page.SpsApiJobsData) && (
          <Route exact path={`${match.path}/sps-api-jobs-data/:id`} component={SpsApiJobsData} />
        )}

        {/* SPS API Jobs Data */}
        <Route exact path={`${match.path}/sps-api-type/detail/:id`} component={TabforCRUDs} />

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default SPSRoutes;
