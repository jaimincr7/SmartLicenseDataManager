import { useAppSelector, useAppDispatch } from '../../../store/app.hooks';
import React, { useEffect } from 'react';
import { Button, Checkbox, Col, Form, Popover, Row, Select } from 'antd';
import { toast } from 'react-toastify';
import { getDatabaseTables } from '../../../store/bulkImport/bulkImport.action';
import {
    clearGetTableColumns,
    clearGlobalTableColumnSelectionMessages,
    globalTableColumnSelectionSelector,
} from '../../../store/user/globalTableColumnSelection/globalTableColumnSelection.reducer';
import { Messages } from '../../../common/constants/messages';
import { IDatabaseTable } from '../../../services/common/common.model';
import {
    getTableColumns,
    saveGlobalTableColumnSelection,
} from '../../../store/user/globalTableColumnSelection/globalTableColumnSelection.action';

const { Option } = Select;

const validateMessages = {
    required: Messages.FIELD_REQUIRED,
};

const TableColumnSelection: React.FC = () => {
    const columnSelection = useAppSelector(globalTableColumnSelectionSelector);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    const [indeterminate, setIndeterminate] = React.useState(false);
    const [checkAll, setCheckAll] = React.useState(false);
    const [defaultTableColumns, setDefaultTableColumns] = React.useState([]);
    const [tableColumns, setTableColumns] = React.useState(null);

    const onFinish = (values: any) => {
        const isAllDeselected = Object.values(tableColumns).every((col) => col === false);
        if (isAllDeselected) {
            toast.info('Please select some columns.');
            return false;
        }
        const inputValues = {
            table_name: values.table_name,
            columns: tableColumns,
        };
        dispatch(saveGlobalTableColumnSelection(inputValues));
    };

    const handleTableChange = (table: string) => {
        if (table) {
            dispatch(getTableColumns(table));
        } else {
            dispatch(clearGetTableColumns());
        }
    };

    useEffect(() => {
        if (columnSelection.saveGlobalTableColumnSelection.messages.length > 0) {
            if (columnSelection.saveGlobalTableColumnSelection.hasErrors) {
                toast.error(columnSelection.saveGlobalTableColumnSelection.messages.join(' '));
            } else {
                toast.success(columnSelection.saveGlobalTableColumnSelection.messages.join(' '));
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
        if (columnSelection.getTableColumns.data) {
            setDefaultTableColumns(columnSelection.getTableColumns.data?.map((col) => col.name));
            let columns: { [key: string]: boolean } = {};
            setIndeterminate(false);
            setCheckAll(true);
            defaultTableColumns.forEach((col) => {
                columns = { ...columns, [col.title]: true };
            });
            setTableColumns(columns);
        }
    }, [columnSelection.getTableColumns.data]);

    React.useEffect(() => {
        handleIndeterminate();
    }, [tableColumns]);

    const handleColumnChange = (e, title) => {
        if (e.target.checked) {
            setTableColumns({ ...tableColumns, [title]: true });
        } else {
            setTableColumns({ ...tableColumns, [title]: false });
        }
        handleIndeterminate();
    };

    const handleIndeterminate = () => {
        const selectedColumns = defaultTableColumns
            .filter((col) => tableColumns[col] !== false)
            .map((x) => x);
        setIndeterminate(
            !!selectedColumns.length && selectedColumns.length < defaultTableColumns.length
        );
        setCheckAll(selectedColumns.length === defaultTableColumns.length);
    };

    const handleSelectAllChange = (e) => {
        let selectedColumns: { [key: string]: boolean } = {};
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        defaultTableColumns.forEach((col) => {
            selectedColumns = { ...selectedColumns, [col]: e.target.checked };
        });
        setTableColumns(selectedColumns);
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
                            checked={tableColumns[col] !== false}
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
                    <h4 className="p-0">Table Column Selection</h4>
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
                            <Button>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default TableColumnSelection;
