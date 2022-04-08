import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/app.hooks';
import React from 'react';
import GlobalSearch from '../../../common/components/globalSearch/GlobalSearch';
import { useParams } from 'react-router-dom';
import { IExcelColumnMappingProps } from './excelColumnMapping.model';
import { clearExcelColumnMapping } from '../../../store/master/excelColumnMapping/excelColumnMapping.reducer';
import MainTable from './MainTable';
import { Page } from '../../../common/constants/pageAction';
import BreadCrumbs from '../../../common/components/Breadcrumbs';

const ExcelColumnMapping: React.FC<IExcelColumnMappingProps> = () => {
  const dispatch = useAppDispatch();

  const { id: urlId } = useParams<{ id?: string }>();

  useEffect(() => {
    return () => {
      dispatch(clearExcelColumnMapping());
    };
  }, []);

  return (
    <div className="ad">
      <div className="title-block">
        <h4 className="p-0">
          <BreadCrumbs pageName={Page.ExcelColumnMapping} />
        </h4>
        <div className="right-title">
          <GlobalSearch />
        </div>
      </div>
      <div className="main-card">
        <MainTable id={+urlId} />
      </div>
    </div>
  );
};

export default ExcelColumnMapping;
