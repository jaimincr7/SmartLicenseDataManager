import React, { ErrorInfo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { addError } from '../../../store/errorLog/errorLog.reducer';
import { InternalServerError } from '../../../pages/InternalServerError';
import { IErrorBoundaryProps, IErrorBoundaryState } from './errorBoundary.model';

class ErrorBoundary extends React.PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: string | ErrorInfo) {
    this.props.addError({ err: error.message, info: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <InternalServerError />;
    }
    return this.props.children;
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ addError }, dispatch);
};

export default connect(null, mapDispatchToProps)(ErrorBoundary);
