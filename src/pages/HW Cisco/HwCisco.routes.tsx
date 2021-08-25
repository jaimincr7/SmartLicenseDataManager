import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import CiscoSiteMatrix from './CiscoSiteMatrix';
import CiscoHost from './CiscoHost';
import CiscoIB from './CiscoIB';
import CiscoPolicy from './CiscoPolicy';
import CiscoProduct from './CiscoProduct';
import CiscoProductAttributes from './CiscoProductAttributes';
import CiscoReady from './CiscoReady';
import CiscoSNTC from './CiscoSNTC';
import CiscoSpectrum from './CiscoSpectrum';

const HwCiscoRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Site Matrix */}
        {ability.can(Action.View, Page.HwCiscoSiteMatrix) && (
          <Route exact path={`${match.path}/cisco-site-matrix/:id`} component={CiscoSiteMatrix} />
        )}
        {ability.can(Action.View, Page.HwCiscoSiteMatrix) && (
          <Route exact path={`${match.path}/cisco-site-matrix`} component={CiscoSiteMatrix} />
        )}

        {/* Host */}
        {ability.can(Action.View, Page.HwCiscoHost) && (
          <Route exact path={`${match.path}/cisco-host/:id`} component={CiscoHost} />
        )}
        {ability.can(Action.View, Page.HwCiscoHost) && (
          <Route exact path={`${match.path}/cisco-host`} component={CiscoHost} />
        )}

        {/* IB */}
        {ability.can(Action.View, Page.HwCiscoIB) && (
          <Route exact path={`${match.path}/cisco-ib/:id`} component={CiscoIB} />
        )}
        {ability.can(Action.View, Page.HwCiscoIB) && (
          <Route exact path={`${match.path}/cisco-ib`} component={CiscoIB} />
        )}

        {/* Policy */}
        {ability.can(Action.View, Page.HwCiscoPolicy) && (
          <Route exact path={`${match.path}/cisco-policy/:id`} component={CiscoPolicy} />
        )}
        {ability.can(Action.View, Page.HwCiscoPolicy) && (
          <Route exact path={`${match.path}/cisco-policy`} component={CiscoPolicy} />
        )}

        {/* Product */}
        {ability.can(Action.View, Page.HwCiscoProduct) && (
          <Route exact path={`${match.path}/cisco-product/:id`} component={CiscoProduct} />
        )}
        {ability.can(Action.View, Page.HwCiscoProduct) && (
          <Route exact path={`${match.path}/cisco-product`} component={CiscoProduct} />
        )}

        {/* Product Attributes */}
        {ability.can(Action.View, Page.HwCiscoProductAttributes) && (
          <Route
            exact
            path={`${match.path}/cisco-product-attributes/:id`}
            component={CiscoProductAttributes}
          />
        )}
        {ability.can(Action.View, Page.HwCiscoProductAttributes) && (
          <Route
            exact
            path={`${match.path}/cisco-product-attributes`}
            component={CiscoProductAttributes}
          />
        )}

        {/* Ready */}
        {ability.can(Action.View, Page.HwCiscoReady) && (
          <Route exact path={`${match.path}/cisco-ready/:id`} component={CiscoReady} />
        )}
        {ability.can(Action.View, Page.HwCiscoReady) && (
          <Route exact path={`${match.path}/cisco-ready`} component={CiscoReady} />
        )}

        {/* SNTC */}
        {ability.can(Action.View, Page.HwCiscoSNTC) && (
          <Route exact path={`${match.path}/cisco-sntc/:id`} component={CiscoSNTC} />
        )}
        {ability.can(Action.View, Page.HwCiscoSNTC) && (
          <Route exact path={`${match.path}/cisco-sntc`} component={CiscoSNTC} />
        )}

        {/* Spectrum */}
        {ability.can(Action.View, Page.HwCiscoSpectrum) && (
          <Route exact path={`${match.path}/cisco-spectrum/:id`} component={CiscoSpectrum} />
        )}
        {ability.can(Action.View, Page.HwCiscoSpectrum) && (
          <Route exact path={`${match.path}/cisco-spectrum`} component={CiscoSpectrum} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default HwCiscoRoutes;
