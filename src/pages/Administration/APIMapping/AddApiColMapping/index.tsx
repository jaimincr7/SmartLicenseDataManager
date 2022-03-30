import { Button, Col, Form, Row, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BreadCrumbs from '../../../../common/components/Breadcrumbs';
import { validateMessages } from '../../../../common/constants/common';
import { Page } from '../../../../common/constants/pageAction';
import { IDatabaseTable, ILookup } from '../../../../services/common/common.model';
import {
  ISaveApiColumnMapping,
  ISearchAPIColumn,
} from '../../../../services/sps/apiColumnMapping/apiColMapping.model';
import { useAppDispatch, useAppSelector } from '../../../../store/app.hooks';
import { getTableColumns, getTables } from '../../../../store/bulkImport/bulkImport.action';
import {
  bulkImportSelector,
  clearGetTableColumns,
} from '../../../../store/bulkImport/bulkImport.reducer';
import { globalSearchSelector } from '../../../../store/globalSearch/globalSearch.reducer';
import {
  apiColLookups,
  getApiColMappingById,
  getApiColumn,
  saveApiColMapping,
} from '../../../../store/sps/apiColumnMapping/apiColMapping.action';
import {
  apiColumnMappingSelector,
  clearApiColMapping,
  clearApiColMappingGetById,
  clearApiColMappingMessages,
} from '../../../../store/sps/apiColumnMapping/apiColMapping.reducer';
import { checkUID } from '../../../../store/sps/spsAPICall/spsApiCall.action';
import {
  clearSpsCheckUID,
  spsApiCallSelector,
} from '../../../../store/sps/spsAPICall/spsApiCall.reducer';
import ApiTable from '../../../SPS/APIsCall/ApiTable';

const { Option } = Select;
let api_id = 0;
let api_type_id = 0;
const AddAPIMapping: React.FC = () => {
  const history = useHistory();

  const [apiColumns, setApiColumns] = useState(null);
  const [tableColumns, setTableColumns] = useState(null);
  const [removedColumns, setRemovedColumns] = useState(null);
  const [error, setError] = useState('');
  const [ShowTableMNodal, setShowTableMNodal] = useState(false);
  const [callApiObj, setCallApiObj] = useState({
    id: 0,
  });
  const spsApis = useAppSelector(spsApiCallSelector);

  const [formUpload] = Form.useForm();
  const [form] = Form.useForm();

  const bulkImports = useAppSelector(bulkImportSelector);
  const globalLookups = useAppSelector(globalSearchSelector);
  const spsAPIColMapping = useAppSelector(apiColumnMappingSelector);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const initialValues = {
    sps_api_id: null,
    table_name: '',
  };

  useEffect(() => {
    return () => {
      dispatch(clearApiColMapping());
      dispatch(clearSpsCheckUID());
    };
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    api_id = Number(params.get('api_id'));
  }, []);

  useEffect(() => {
    if (api_id > 0 && spsAPIColMapping.columnLookups.data?.length > 0) {
      formUpload.setFieldsValue({ sps_api_id: api_id });
      api_id = 0;
    }
  }, [spsAPIColMapping.columnLookups.data]);

  useEffect(() => {
    if (Number(id) > 0) {
      dispatch(getApiColMappingById(Number(id)));
    }
  }, [id]);

  useEffect(() => {
    const data = spsAPIColMapping.getById.data;
    if (data) {
      formUpload.setFieldsValue({ sps_api_id: data.api_id, table_name: data.table_name });
      // const searchApiColObj: ISearchAPIColumn = {
      //   id: spsAPIColMapping.getById.data.api_id,
      //   company_id: globalLookups.search.company_id,
      //   bu_id: globalLookups.search.bu_id,
      //   tenant_id: globalLookups.search.tenant_id,
      // };
      // dispatch(getApiColumn(searchApiColObj));
      dispatch(checkUID(data.api_id));
      handleTableChange(data.table_name);
      setFormFields();
    }
  }, [spsAPIColMapping.getById.data]);

  useEffect(() => {
    if (!(bulkImports.getTables.data && bulkImports.getTables.data.length > 0)) {
      dispatch(getTables());
    }
    if (!(spsAPIColMapping.columnLookups.data && spsAPIColMapping.columnLookups.data.length > 0)) {
      dispatch(apiColLookups());
    }
  }, [dispatch]);

  const handleTableChange = (table: string) => {
    if (table) {
      dispatch(getTableColumns(table));
    } else {
      setApiColumns(null);
      setTableColumns(null);
      dispatch(clearGetTableColumns());
      dispatch(clearApiColMappingGetById());
    }
  };

  const setFormFields = async () => {
    let mappingArray = [];
    if (spsAPIColMapping.getById.data?.mapping?.length > 0) {
      mappingArray = JSON.parse(spsAPIColMapping.getById.data?.mapping);
    }
    setApiColumns(null);
    const filterApiColumns = spsAPIColMapping.apiColumn.data;
    const columnsArray = ['tenantid', 'companyid', 'bu_id', 'date added'];
    const filterTableColumns = bulkImports.getTableColumns.data?.filter(
      (x) => !columnsArray.includes(x.name?.toLowerCase())
    );
    const removedColumns = bulkImports.getTableColumns.data?.filter((x) =>
      columnsArray.includes(x.name?.toLowerCase())
    );
    setApiColumns(filterApiColumns);
    setTableColumns(filterTableColumns);
    setRemovedColumns(removedColumns);

    const initialValuesData: any = {};
    filterTableColumns?.map(function (ele) {
      if (mappingArray?.length > 0) {
        const mapObj = mappingArray?.find((x) => x.key === ele.name);
        if (
          mapObj &&
          Array.isArray(filterApiColumns) &&
          filterApiColumns?.includes(mapObj?.value)
        ) {
          form.setFieldsValue({ [ele.name]: mapObj.value });
        }
      } else {
        initialValuesData[ele.name] =
          filterApiColumns?.filter(
            (x: any) =>
              x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
              ele.name.toLowerCase()?.replace(/\s/g, '')
          ).length > 0
            ? filterApiColumns.filter(
                (x: any) =>
                  x?.toString()?.toLowerCase()?.replace(/\s/g, '') ===
                  ele.name.toLowerCase()?.replace(/\s/g, '')
              )[0]
            : '';
      }
    });
    form?.setFieldsValue(initialValuesData);
  };

  useEffect(() => {
    if (bulkImports.getTableColumns.data?.length > 0 || spsAPIColMapping.apiColumn.data?.length > 0)
      setApiColumns(null);
    setFormFields();
  }, [bulkImports.getTableColumns.data, spsAPIColMapping.apiColumn.data]);

  const onFinish = (values: any) => {
    dispatch(checkUID(values.sps_api_id));

    // dispatch(getApiColumn(searchApiColObj));
  };

  useEffect(() => {
    if (spsApis.checkUID.data) {
      if (spsApis.checkUID.data.is_uid_selection) {
        api_type_id = spsApis.checkUID.data.api_type_id;
        setCallApiObj({ id: formUpload.getFieldValue('sps_api_id') });
        setShowTableMNodal(true);
      } else {
        const searchApiColObj: ISearchAPIColumn = {
          id: formUpload.getFieldValue('sps_api_id'),
        };
        dispatch(getApiColumn(searchApiColObj));
      }
    }
  }, [spsApis.checkUID.data]);

  useEffect(() => {
    Object.keys(globalLookups.search).forEach(function (key) {
      if (globalLookups.search[key]) {
        setError('');
      }
    });
  }, [globalLookups.search]);

  useEffect(() => {
    if (spsAPIColMapping.save.messages?.length > 0) {
      if (spsAPIColMapping.save.hasErrors) {
        toast.error(spsAPIColMapping.save.messages.join(' '));
      } else {
        toast.success(spsAPIColMapping.save.messages.join(' '));
        history.goBack();
      }
      dispatch(clearApiColMappingMessages());
    }
  }, [spsAPIColMapping.save.messages]);

  const onSaveMapping = (values: any) => {
    const valObj = { ...values };
    delete valObj.tenant_id;
    delete valObj.company_id;
    delete valObj.bu_id;
    delete valObj.date_added;
    const sqlToApiMapping = [];
    Object.entries(valObj)?.forEach(([key, value]) => {
      if (key && value) {
        sqlToApiMapping.push({
          key: `${key}`,
          value: `${value}`,
        });
      }
    });

    if (sqlToApiMapping.length === 0) {
      toast.error('Atleast 1 mapping is required!');
      return false;
    }
    const uploadValue = formUpload.getFieldsValue();
    const saveApiColMappingObj: ISaveApiColumnMapping = {
      id: Number(id) ?? 0,
      table_name: uploadValue?.table_name,
      api_id: uploadValue?.sps_api_id,
      mapping: JSON.stringify(sqlToApiMapping),
    };
    dispatch(saveApiColMapping(saveApiColMappingObj));
  };

  return (
    <>
      <div className="update-excel-page">
        <div className="title-block">
          <h4 className="p-0">
            <BreadCrumbs pageName={Page.ConfigSPSColMapping} />
          </h4>
          <div className="btns-block">
            <Button
              className="btn-icon"
              type="primary"
              onClick={() => history.goBack()}
              icon={
                <em className="anticon">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/ic-left-arrow.svg`} alt="" />
                </em>
              }
            >
              Back
            </Button>
          </div>
        </div>

        <div className="main-card">
          <div className="input-btns-title">
            <Form
              form={formUpload}
              name="formUpload"
              initialValues={initialValues}
              onFinish={onFinish}
            >
              <Row gutter={[30, 20]} className="align-item-start">
                <Col xs={24} md={6}>
                  <div className="form-group m-0">
                    <label className="label">SPS API</label>
                    <Form.Item
                      name="sps_api_id"
                      className="m-0"
                      rules={[{ required: true, message: 'API is Required' }]}
                    >
                      <Select
                        onChange={(val) => {
                          if (!val) {
                            setApiColumns(null);
                            setTableColumns(null);
                            form.setFieldsValue({});
                            dispatch(clearApiColMappingGetById());
                          }
                        }}
                        allowClear
                        showSearch
                        dropdownClassName="value-box-select"
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          optionA.children
                            ?.toLowerCase()
                            ?.localeCompare(optionB.children?.toLowerCase())
                        }
                        loading={spsAPIColMapping.columnLookups.loading}
                      >
                        {spsAPIColMapping.columnLookups.data?.map((option: ILookup) => (
                          <Option key={option.id} value={option.id}>
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={6}>
                  <div className="form-group m-0">
                    <label className="label">Table Name</label>
                    <Form.Item
                      name={'table_name'}
                      className="m-0"
                      rules={[{ required: true, message: 'Table is Required' }]}
                    >
                      <Select
                        allowClear
                        dropdownClassName="value-box-select"
                        onChange={handleTableChange}
                        loading={bulkImports.getTables.loading}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA: any, optionB: any) =>
                          optionA.children
                            ?.toLowerCase()
                            ?.localeCompare(optionB.children?.toLowerCase())
                        }
                      >
                        {bulkImports.getTables.data?.map(
                          (option: IDatabaseTable, index: number) => (
                            <Option key={index} value={option.name}>
                              {option.name}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              {error && (
                <>
                  <br />
                  <span style={{ color: 'red' }}>{error}</span>
                </>
              )}
              <Row>
                <Col xs={24} md={2}>
                  <div className="form-group m-0">
                    <label className="label"></label>
                    <Form.Item className="m-0">
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        loading={spsAPIColMapping.apiColumn.loading || spsApis.checkUID.loading}
                      >
                        Fetch
                      </Button>
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={2}>
                  <div className="form-group m-0">
                    <label className="label"></label>
                    <Form.Item className="m-0">
                      <Button
                        key="button"
                        type="default"
                        htmlType="button"
                        onClick={() => {
                          history.push('/administration/config-sps-api-column-mapping');
                        }}
                      >
                        Cancel
                      </Button>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
          {(spsAPIColMapping.apiColumn.loading || bulkImports.getTableColumns.loading) && (
            <div className="spin-loader">
              <Spin spinning={true} />
            </div>
          )}

          <Form
            form={form}
            name="uploadExcelSheet"
            onFinish={onSaveMapping}
            validateMessages={validateMessages}
          >
            {removedColumns && apiColumns?.length > 0 && tableColumns?.length > 0 && (
              <>
                <Row gutter={[30, 0]} className="form-label-hide">
                  <Col xs={24} md={12} lg={12} xl={8}>
                    <div className="form-group form-inline">
                      <label className="label strong">Database Column</label>
                      <label className="strong">API Column</label>
                    </div>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={8} className="sm-none">
                    <div className="form-group form-inline">
                      <label className="label strong">Database Column</label>
                      <label className="strong">API Column</label>
                    </div>
                  </Col>
                  <Col xs={24} md={12} lg={12} xl={8} className="lg-none">
                    <div className="form-group form-inline">
                      <label className="label strong">Database Column</label>
                      <label className="strong">API Column</label>
                    </div>
                  </Col>
                  {tableColumns?.map((col, index: number) => (
                    <Col xs={24} md={12} lg={12} xl={8} key={index}>
                      <div className="form-group form-inline">
                        <label className="label">{col.name}</label>
                        <Form.Item
                          name={col.name}
                          className="m-0 w-100"
                          label={col.name}
                          rules={[{ required: col.is_nullable === 'NO' ? true : false }]}
                        >
                          <Select
                            showSearch
                            allowClear
                            suffixIcon={
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/ic-down.svg`}
                                alt=""
                              />
                            }
                            optionFilterProp="children"
                            filterOption={(input, option: any) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              optionA.children
                                ?.toLowerCase()
                                ?.localeCompare(optionB.children?.toLowerCase())
                            }
                          >
                            {apiColumns?.map((option: string, index: number) => (
                              <Option key={index} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                  ))}
                </Row>
                <div className="btns-block">
                  <Button type="primary" htmlType="submit" loading={spsAPIColMapping.save.loading}>
                    Save
                  </Button>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
      {ShowTableMNodal && api_type_id && (
        <ApiTable
          type_id={api_type_id}
          showModal={ShowTableMNodal}
          callApiObj={callApiObj}
          isFetchApi={true}
          handleModalClose={() => {
            setShowTableMNodal(false);
          }}
        />
      )}
    </>
  );
};

export default AddAPIMapping;
