import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import O365ActivationsUserDetail from './O365ActivationsUserDetail';
import O365ActiveUserDetail from './O365ActiveUserDetail';
import O365M365AppsUsageUserDetail from './O365M365AppsUsageUserDetail';
import O365MailboxUsage from './O365MailboxUsage';
import O365OneDriveUsage from './O365OneDriveUsage';
import O365ProductList from './O365ProductList';
import O365Reservations from './O365Reservations';
import O365Subscriptions from './O365Subscriptions';
import O365SubscribedSkus from './O365SubscribedSkus';
import O365Users from './O365Users';
// import O365Reservations from './O365Reservations';
// import O365Users from './O365Users';

const O365Routes: React.FC = () => {
  const match = useRouteMatch();

  return (
    <div className="o365">
      <Switch>
        {/* Users */}
        {ability.can(Action.View, Page.O365Users) && (
          <Route exact path={`${match.path}/o365-users/:id`} component={O365Users} />
        )}
        {ability.can(Action.View, Page.O365Users) && (
          <Route exact path={`${match.path}/o365-users`} component={O365Users} />
        )}

        {/* OneDrive usage */}
        {ability.can(Action.View, Page.O365Reservations) && (
          <Route exact path={`${match.path}/o365-reservations/:id`} component={O365Reservations} />
        )}
        {ability.can(Action.View, Page.O365Reservations) && (
          <Route exact path={`${match.path}/o365-reservations`} component={O365Reservations} />
        )}

        {/* Product List */}
        {ability.can(Action.View, Page.O365ProductList) && (
          <Route exact path={`${match.path}/o365-product-list/:id`} component={O365ProductList} />
        )}
        {ability.can(Action.View, Page.O365ProductList) && (
          <Route exact path={`${match.path}/o365-product-list`} component={O365ProductList} />
        )}

        {/* OneDrive usage */}
        {ability.can(Action.View, Page.O365OneDriveUsage) && (
          <Route
            exact
            path={`${match.path}/o365-one-drive-usage/:id`}
            component={O365OneDriveUsage}
          />
        )}
        {ability.can(Action.View, Page.O365OneDriveUsage) && (
          <Route exact path={`${match.path}/o365-one-drive-usage`} component={O365OneDriveUsage} />
        )}

        {/* Mailbox usage */}
        {ability.can(Action.View, Page.O365MailboxUsage) && (
          <Route exact path={`${match.path}/o365-mailbox-usage/:id`} component={O365MailboxUsage} />
        )}
        {ability.can(Action.View, Page.O365MailboxUsage) && (
          <Route exact path={`${match.path}/o365-mailbox-usage`} component={O365MailboxUsage} />
        )}

        {/* M365 apps usage User Detail */}
        {ability.can(Action.View, Page.O365M365AppsUsageUserDetail) && (
          <Route
            exact
            path={`${match.path}/o365-m365-apps-usage-user-detail/:id`}
            component={O365M365AppsUsageUserDetail}
          />
        )}
        {ability.can(Action.View, Page.O365M365AppsUsageUserDetail) && (
          <Route
            exact
            path={`${match.path}/o365-m365-apps-usage-user-detail`}
            component={O365M365AppsUsageUserDetail}
          />
        )}

        {/* Active User Detail */}
        {ability.can(Action.View, Page.O365ActiveUserDetail) && (
          <Route
            exact
            path={`${match.path}/o365-active-user-detail/:id`}
            component={O365ActiveUserDetail}
          />
        )}
        {ability.can(Action.View, Page.O365ActiveUserDetail) && (
          <Route
            exact
            path={`${match.path}/o365-active-user-detail`}
            component={O365ActiveUserDetail}
          />
        )}

        {/* Activations User Detail */}
        {ability.can(Action.View, Page.O365ActivationsUserDetail) && (
          <Route
            exact
            path={`${match.path}/o365-activations-user-detail/:id`}
            component={O365ActivationsUserDetail}
          />
        )}
        {ability.can(Action.View, Page.O365ActivationsUserDetail) && (
          <Route
            exact
            path={`${match.path}/o365-activations-user-detail`}
            component={O365ActivationsUserDetail}
          />
        )}

        {/* Subscriptions */}
        {ability.can(Action.View, Page.O365Subscriptions) && (
          <Route
            exact
            path={`${match.path}/o365-subscriptions/:id`}
            component={O365Subscriptions}
          />
        )}
        {ability.can(Action.View, Page.O365Subscriptions) && (
          <Route exact path={`${match.path}/o365-subscriptions`} component={O365Subscriptions} />
        )}

        {/* SubscribedSkus */}
        {ability.can(Action.View, Page.O365SubscribedSkus) && (
          <Route
            exact
            path={`${match.path}/o365-subscribed-skus/:id`}
            component={O365SubscribedSkus}
          />
        )}
        {ability.can(Action.View, Page.O365SubscribedSkus) && (
          <Route exact path={`${match.path}/o365-subscribed-skus`} component={O365SubscribedSkus} />
        )}

        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default O365Routes;
