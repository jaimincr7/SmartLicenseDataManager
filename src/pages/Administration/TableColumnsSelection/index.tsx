import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import React, { useEffect } from 'react';
import { Button, Checkbox, Col, Form, Popover, Row, Select } from 'antd';
import { toast } from 'react-toastify';
import {
  clearGetGlobalTableColumns,
  clearGetTableColumns,
  clearGlobalTableColumnSelectionMessages,
  globalTableColumnSelectionSelector,
  setGlobalTableColumns,
  setGlobalTableColumnSelection,
} from '../../../store/administration/globalTableColumnSelection/globalTableColumnSelection.reducer';
import { validateMessages } from '../../../common/constants/common';
import { IDatabaseTable } from '../../../services/common/common.model';
import {
  getDatabaseTables,
  getGlobalTableColumns,
  getTableColumns,
  saveGlobalTableColumnSelection,
} from '../../../store/administration/globalTableColumnSelection/globalTableColumnSelection.action';
import BreadCrumbs from '../../../common/components/Breadcrumbs';
import { Page } from '../../../common/constants/pageAction';

const { Option } = Select;

const TableColumnSelection: React.FC = () => {
  const columnSelection = useAppSelector(globalTableColumnSelectionSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const [defaultTableColumns, setDefaultTableColumns] = React.useState([]);

  const onFinish = () => {
    const isAllDeselected = Object.values(columnSelection.getGlobalTableColumns.data.columns).every(
      (col) => col === false
    );
    if (isAllDeselected && columnSelection.getGlobalTableColumns.data.id) {
      toast.info('Please select some columns.');
      return false;
    }
    const finalData = {
      id: columnSelection.getGlobalTableColumns.data.id,
      table_name: form.getFieldValue('table_name'),
      columns: columnSelection.getGlobalTableColumns.data.columns,
    };
    dispatch(saveGlobalTableColumnSelection(finalData)).then((res) => {
      dispatch(setGlobalTableColumns(res.payload.data));
    });
  };

  const handleTableChange = (table: string) => {
    if (table) {
      dispatch(getTableColumns(table)).then(async (res: any) => {
        if (res.payload) {
          const columnsArr = res.payload.map((col) => col.name);
          await setDefaultTableColumns([...columnsArr, 'Actions']);
        }
      });
      dispatch(getGlobalTableColumns(table)).then(async (res) => {
        if (res?.payload) {
          await dispatch(setGlobalTableColumns(res.payload));
        } else {
          dispatch(clearGetGlobalTableColumns());
          await setTableColumns();
        }
      });
    } else {
      dispatch(clearGetTableColumns());
    }
  };

  const resetPage = () => {
    dispatch(clearGetTableColumns());
    form.resetFields(['table_name']);
  };

  const setTableColumns = async () => {
    if (defaultTableColumns.length > 0 && !columnSelection.getGlobalTableColumns.data.id) {
      let selectedColumn: { [key: string]: boolean } = {};
      defaultTableColumns.forEach((col) => {
        selectedColumn = { ...selectedColumn, [col]: true };
      });
      const globalTableColumns = {
        id: null,
        table_name: form.getFieldValue('table_name'),
        columns: JSON.stringify(selectedColumn),
      };
      await dispatch(setGlobalTableColumns(globalTableColumns));
    }
  };

  useEffect(() => {
    if (columnSelection.saveGlobalTableColumnSelection.messages.length > 0) {
      if (columnSelection.saveGlobalTableColumnSelection.hasErrors) {
        toast.error(columnSelection.saveGlobalTableColumnSelection.messages.join(' '));
      } else {
        toast.success(columnSelection.saveGlobalTableColumnSelection.messages.join(' '));
        resetPage();
      }
      dispatch(clearGlobalTableColumnSelectionMessages());
    }
  }, [columnSelection.saveGlobalTableColumnSelection.messages]);

  React.useEffect(() => {
    dispatch(getDatabaseTables());
    return () => {
      clearGetTableColumns();
    };
  }, [dispatch]);

  React.useEffect(() => {
    setTableColumns();
    handleIndeterminate();
  }, [defaultTableColumns]);

  React.useEffect(() => {
    handleIndeterminate();
  }, [columnSelection.getGlobalTableColumns.data.columns]);

  const handleColumnChange = (e, title) => {
    if (e.target.checked) {
      dispatch(
        setGlobalTableColumnSelection({
          ...columnSelection.getGlobalTableColumns.data.columns,
          [title]: true,
        })
      );
    } else {
      dispatch(
        setGlobalTableColumnSelection({
          ...columnSelection.getGlobalTableColumns.data.columns,
          [title]: false,
        })
      );
    }
    handleIndeterminate();
  };

  const handleIndeterminate = async () => {
    const selectedColumns = defaultTableColumns
      .filter((col) => columnSelection.getGlobalTableColumns.data.columns[col] !== false)
      .map((x) => x);
    await setIndeterminate(
      !!selectedColumns.length && selectedColumns.length < defaultTableColumns.length
    );
    await setCheckAll(selectedColumns.length === defaultTableColumns.length);
  };

  const handleSelectAllChange = (e) => {
    let selectedColumns: { [key: string]: boolean } = {};
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    defaultTableColumns.forEach((col) => {
      selectedColumns = { ...selectedColumns, [col]: e.target.checked };
    });
    dispatch(setGlobalTableColumnSelection(selectedColumns));
  };

  const dropdownMenu = (
    <div className="checkbox-list-wrapper">
      <ul className="checkbox-list">
        <li className="line-bottom">
          <Checkbox
            className="strong"
            checked={checkAll}
            onClick={handleSelectAllChange}
            indeterminate={indeterminate}
          >
            Select All
          </Checkbox>
        </li>
        {defaultTableColumns.map((col) => (
          <li key={col}>
            <Checkbox
              checked={columnSelection.getGlobalTableColumns.data.columns[col] !== false}
              onClick={(e) => handleColumnChange(e, col)}
            >
              {col}
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <div className="update-excel-page">
        <div className="title-block">
          <h4 className="p-0">
            <BreadCrumbs pageName={Page.GlobalTableColumnSelection} />
          </h4>
        </div>
        <div className="main-card">
          <Form
            form={form}
            name="uploadExcelSheet"
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={[30, 0]} className="form-label-hide">
              <Col xs={24} sm={12} md={8}>
                <div className="form-group">
                  <label className="label">Table Name</label>
                  <Form.Item
                    name="table_name"
                    className="m-0"
                    label="Table Name"
                    rules={[{ required: true }]}
                  >
                    <Select
                      showSearch
                      placeholder="Please Select"
                      onChange={handleTableChange}
                      allowClear
                      loading={columnSelection.getDatabaseTables.loading}
                    >
                      {columnSelection.getDatabaseTables.data?.map(
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
              {form.getFieldValue('table_name') && (
                <Popover
                  content={form.getFieldValue('table_name') ? dropdownMenu : <></>}
                  trigger="click"
                  overlayClassName="custom-popover"
                >
                  <Button
                    style={{ marginTop: '26px' }}
                    className="mt-5"
                    icon={
                      <em className="anticon">
                        <img src={`${process.env.PUBLIC_URL}/assets/images/ic-lines.svg`} alt="" />
                      </em>
                    }
                    loading={columnSelection.getTableColumns.loading}
                  >
                    Select Columns
                  </Button>
                </Popover>
              )}
            </Row>
            <div className="btns-block">
              <Button
                type="primary"
                htmlType="submit"
                loading={columnSelection.saveGlobalTableColumnSelection.loading}
              >
                Save
              </Button>
              <Button onClick={() => resetPage()}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default TableColumnSelection;
