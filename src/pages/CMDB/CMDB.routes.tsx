import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import Application from './Application';
import Device from './Device';
import OperatingSystem from './OperatingSystem';
import Processor from './Processor';
import Software from './Software';
import Virtualization from './Virtualization';
import LicenseModel from './LicenseModel';
import User from './User';
import UserMap from './UserMap';
import Exclusion from './Exclusion';
import OsNormalization from './OsNormalization';
import SoftwareNormalization from './SoftwareNormalization';

const CmdbRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Operating System */}
        {ability.can(Action.View, Page.CmdbOperatingSystem) && (
          <Route
            exact
            path={`${match.path}/cmdb-operating-system/:id`}
            component={OperatingSystem}
          />
        )}
        {ability.can(Action.View, Page.CmdbOperatingSystem) && (
          <Route exact path={`${match.path}/cmdb-operating-system`} component={OperatingSystem} />
        )}

        {/* Processor */}
        {ability.can(Action.View, Page.CmdbProcessor) && (
          <Route exact path={`${match.path}/cmdb-processor/:id`} component={Processor} />
        )}
        {ability.can(Action.View, Page.CmdbProcessor) && (
          <Route exact path={`${match.path}/cmdb-processor`} component={Processor} />
        )}

        {/* Virtualization */}
        {ability.can(Action.View, Page.CmdbVirtualization) && (
          <Route exact path={`${match.path}/cmdb-virtualization/:id`} component={Virtualization} />
        )}
        {ability.can(Action.View, Page.CmdbVirtualization) && (
          <Route exact path={`${match.path}/cmdb-virtualization`} component={Virtualization} />
        )}

        {/* Application */}
        {ability.can(Action.View, Page.CmdbApplication) && (
          <Route exact path={`${match.path}/cmdb-application/:id`} component={Application} />
        )}
        {ability.can(Action.View, Page.CmdbApplication) && (
          <Route exact path={`${match.path}/cmdb-application`} component={Application} />
        )}

        {/* Device */}
        {ability.can(Action.View, Page.CmdbDevice) && (
          <Route exact path={`${match.path}/cmdb-device/:id`} component={Device} />
        )}
        {ability.can(Action.View, Page.CmdbDevice) && (
          <Route exact path={`${match.path}/cmdb-device`} component={Device} />
        )}

        {/* License Model */}
        {ability.can(Action.View, Page.CmdbLicenseModel) && (
          <Route exact path={`${match.path}/cmdb-license-model/:id`} component={LicenseModel} />
        )}
        {ability.can(Action.View, Page.CmdbLicenseModel) && (
          <Route exact path={`${match.path}/cmdb-license-model`} component={LicenseModel} />
        )}

        {/* Software */}
        {ability.can(Action.View, Page.CmdbSoftware) && (
          <Route exact path={`${match.path}/cmdb-software/:id`} component={Software} />
        )}
        {ability.can(Action.View, Page.CmdbSoftware) && (
          <Route exact path={`${match.path}/cmdb-software`} component={Software} />
        )}

        {/* Os Normalization */}
        {ability.can(Action.View, Page.CmdbOsNormalization) && (
          <Route
            exact
            path={`${match.path}/cmdb-os-normalization/:id`}
            component={OsNormalization}
          />
        )}
        {ability.can(Action.View, Page.CmdbOsNormalization) && (
          <Route exact path={`${match.path}/cmdb-os-normalization`} component={OsNormalization} />
        )}

        {/* Software Normalization */}
        {ability.can(Action.View, Page.CmdbSoftwareNormalization) && (
          <Route
            exact
            path={`${match.path}/cmdb-software-normalization/:id`}
            component={SoftwareNormalization}
          />
        )}
        {ability.can(Action.View, Page.CmdbSoftwareNormalization) && (
          <Route
            exact
            path={`${match.path}/cmdb-software-normalization`}
            component={SoftwareNormalization}
          />
        )}

        {/* User */}
        {ability.can(Action.View, Page.CmdbUser) && (
          <Route exact path={`${match.path}/cmdb-user/:id`} component={User} />
        )}
        {ability.can(Action.View, Page.CmdbUser) && (
          <Route exact path={`${match.path}/cmdb-user`} component={User} />
        )}

        {/* Exclusion */}
        {ability.can(Action.View, Page.CmdbExclusion) && (
          <Route exact path={`${match.path}/cmdb-exclusion/:id`} component={Exclusion} />
        )}
        {ability.can(Action.View, Page.CmdbExclusion) && (
          <Route exact path={`${match.path}/cmdb-exclusion`} component={Exclusion} />
        )}

        {/* UserMap */}
        {ability.can(Action.View, Page.CmdbUserMap) && (
          <Route exact path={`${match.path}/cmdb-user-map/:id`} component={UserMap} />
        )}
        {ability.can(Action.View, Page.CmdbUserMap) && (
          <Route exact path={`${match.path}/cmdb-user-map`} component={UserMap} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default CmdbRoutes;
