import AppRoutes from './App.routes';
import 'antd/dist/antd.css';
import './App.scss';
import './assets/css/style.scss';
import ErrorBoundary from './common/components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <AppRoutes />
      </div>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
