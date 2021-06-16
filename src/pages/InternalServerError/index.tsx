import React from 'react';
import { errorLogSelector } from '../../store/errorLog/errorLog.reducer';
import { useAppSelector } from '../../store/app.hooks';

export const InternalServerError: React.FC = () => {
  const errors = useAppSelector(errorLogSelector);
  return (
    <>
      <h1>Something Went Wrong!!!</h1>
      <p>{JSON.stringify(errors)}</p>
    </>
  );
};
