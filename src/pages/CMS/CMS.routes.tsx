import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ability from '../../common/ability';
import { Action, Page } from '../../common/constants/pageAction';
import CategoryExtended from './CategoryExtended';
import CmsCategory from './CmsCategory';
import Contact from './Contact';
import ContractAgreement from './ContractAgreement';
import ContractAgreementAttachment from './ContractAgreementAttachment';
import Purchase from './Purchase';
import PurchaseLineItem from './PurchaseLineItem';
import TriggerType from './TriggerType';
import Vendor from './Vendor';

const CMSRoutes: React.FC = () => {
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

        {/* Purchase */}
        {ability.can(Action.View, Page.CmsPurchase) && (
          <Route exact path={`${match.path}/cms-purchase/:id`} component={Purchase} />
        )}
        {ability.can(Action.View, Page.CmsPurchase) && (
          <Route exact path={`${match.path}/cms-purchase`} component={Purchase} />
        )}

        {/* PurchaseLineItem */}
        {ability.can(Action.View, Page.CmsPurchaseLineItem) && (
          <Route
            exact
            path={`${match.path}/cms-purchase-line-item/:id`}
            component={PurchaseLineItem}
          />
        )}
        {ability.can(Action.View, Page.CmsPurchaseLineItem) && (
          <Route exact path={`${match.path}/cms-purchase-line-item`} component={PurchaseLineItem} />
        )}

        {/* TriggerType */}
        {ability.can(Action.View, Page.CmsTriggerType) && (
          <Route exact path={`${match.path}/cms-trigger-type/:id`} component={TriggerType} />
        )}
        {ability.can(Action.View, Page.CmsTriggerType) && (
          <Route exact path={`${match.path}/cms-trigger-type`} component={TriggerType} />
        )}

        {/* Vendor */}
        {ability.can(Action.View, Page.CmsVendor) && (
          <Route exact path={`${match.path}/cms-vendor/:id`} component={Vendor} />
        )}
        {ability.can(Action.View, Page.CmsVendor) && (
          <Route exact path={`${match.path}/cms-vendor`} component={Vendor} />
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

        {/* Contact */}
        {ability.can(Action.View, Page.CmsContact) && (
          <Route exact path={`${match.path}/cms-contact/:id`} component={Contact} />
        )}
        {ability.can(Action.View, Page.CmsContact) && (
          <Route exact path={`${match.path}/cms-contact`} component={Contact} />
        )}

        {/* ContractAgreement */}
        {ability.can(Action.View, Page.CmsContractAgreement) && (
          <Route
            exact
            path={`${match.path}/cms-contract-agreement/:id`}
            component={ContractAgreement}
          />
        )}
        {ability.can(Action.View, Page.CmsContractAgreement) && (
          <Route
            exact
            path={`${match.path}/cms-contract-agreement`}
            component={ContractAgreement}
          />
        )}

        {/* ContractAgreementAttachment */}
        {ability.can(Action.View, Page.CmsContractAgreementAttachment) && (
          <Route
            exact
            path={`${match.path}/cms-contract-agreement-attachment/:id`}
            component={ContractAgreementAttachment}
          />
        )}
        {ability.can(Action.View, Page.CmsContractAgreementAttachment) && (
          <Route
            exact
            path={`${match.path}/cms-contract-agreement-attachment`}
            component={ContractAgreementAttachment}
          />
        )}
        {/* keep least always */}
        <Route path={`${match.path}/*`}>
          <Redirect to={`/404`} />
        </Route>
      </Switch>
    </div>
  );
};

export default CMSRoutes;
