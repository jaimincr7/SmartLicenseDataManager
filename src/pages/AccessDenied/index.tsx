import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const AccessDeniedPage: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={() => history.push(`/`)}>
            Back Home
          </Button>
        }
      />
    </>
  );
};
