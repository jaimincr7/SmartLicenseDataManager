import AppRoutes from './App.routes';
import './App.scss';
import './assets/css/style.scss';
import ErrorBoundary from './common/components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './utils/authConfig';
import ability, { AbilityContext, UpdateAbility } from './common/ability';

function App() {
  const msalInstance = new PublicClientApplication(msalConfig);

  return (
    <ErrorBoundary>
      <div className="App">
        <MsalProvider instance={msalInstance}>
          <AbilityContext.Provider value={ability}>
            <UpdateAbility />
            <AppRoutes />
          </AbilityContext.Provider>
        </MsalProvider>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
