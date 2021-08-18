import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import CategoryExtended from './CategoryExtended';
import CmsCategory from './CmsCategory';

const HwCiscoRoutes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="sqlServer">
      <Switch>
        {/* Category */}
        {ability.can(Action.View, Page.CmsCategory) && (
          <Route exact path={`${match.path}/cms-category/:id`} component={CmsCategory} />
        )}
        {ability.can(Action.View, Page.CmsCategory) && (
          <Route exact path={`${match.path}/cms-category`} component={CmsCategory} />
        )}

        {/* Category Extended */}
        {ability.can(Action.View, Page.CmsCategoryExtended) && (
          <Route
            exact
            path={`${match.path}/cms-category-extended/:id`}
            component={CategoryExtended}
          />
        )}
        {ability.can(Action.View, Page.CmsCategoryExtended) && (
          <Route exact path={`${match.path}/cms-category-extended`} component={CategoryExtended} />
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
