import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AdDevices from './AdDevices';
import ImportExcel from './AdDevices/ImportExcel';

const AdRoutes: React.FC = () => {
    const match = useRouteMatch();

    return (
        <div className="sqlServer">
            <Switch>
                <Route exact path={`${match.path}/update-from-excel`} component={ImportExcel} />
                <Route exact path={`${match.path}/:id`} component={AdDevices} />

                {/* keep least always */}
                <Route exact path={`${match.path}`} component={AdDevices} />
            </Switch>
        </div>
    );
};

export default AdRoutes;
