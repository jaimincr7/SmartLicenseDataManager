import React, { ErrorInfo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { addError } from '../../../store/errorLog/errorLog.reducer';
//import { InternalServerError } from '../../../pages/InternalServerError';
import { IErrorBoundaryProps, IErrorBoundaryState } from './errorBoundary.model';
import commonService from '../../../services/common/common.service';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: string | ErrorInfo) {
    toast.error('Oops! Something went wrong.');
    const json = {
      error: error.message,
      errorStack: errorInfo,
    };
    const obj = {
      environment: 'FE',
      json: JSON.stringify(json),
    };
    commonService.errorLog(obj);
    this.props.addError({ err: error.message, info: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      toast.error('Please check error log for more information.');
    }
    return this.props.children;
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ addError }, dispatch);
};

export default connect(null, mapDispatchToProps)(ErrorBoundary);
