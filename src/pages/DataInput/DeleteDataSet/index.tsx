import { Button, Col, Form, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../common/components/Breadcrumbs";
import DeleteDatasetModal from "../../../common/components/DeleteDatasetModal";
import { Page } from "../../../common/constants/pageAction";
import { useAppDispatch, useAppSelector } from "../../../store/app.hooks";
import { getTablesForDelete } from "../../../store/common/common.action";
import { commonSelector } from "../../../store/common/common.reducer";
import { IDeleteDataSet } from "./deleteDataSet.model";

const { Option } = Select;

const DeleteDataSet: React.FC<IDeleteDataSet> = () => {
    const common = useAppSelector(commonSelector);
    const dispatch = useAppDispatch();
    const [table, setTable] = useState(null);
    const [form] = Form.useForm();
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [dateAvailable, setDateAvailable] = useState(true);

    useEffect(() => {
        dispatch(getTablesForDelete());
    }, []);

    const onChange = (tableName) => {
        setTable(tableName);
        const record = common.tablesForDelete.data?.filter(data => data.table_name == tableName);
        if (record.length) {
            setDateAvailable(record[0].is_date_available);
        }
    };

    return (
        <>
            <div className="update-excel-page">
                <div className="title-block">
                    <h4 className="p-0">
                        <BreadCrumbs pageName={Page.DeleteData} />
                    </h4>
                </div>
                <div className="main-card">
                    <div>
                        <Form form={form} name="formUpload">
                            <Row gutter={[30, 30]} className="align-item-start">
                                <Col xs={24} md={8}>
                                    <label className="label w-100">Table Name</label>
                                    <Form.Item name={'table_name'} className="m-0">
                                        <Select
                                            showSearch
                                            allowClear
                                            onChange={onChange}
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
                                            {common.tablesForDelete.data?.map(
                                                (option: any) => (
                                                    <Option key={option.id} value={option.table_name}>
                                                        {option.table_name}
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <label className="label w-100"></label>
                                    <Button type="primary" disabled={table == null} onClick={() => setDeleteModalVisible(true)}>
                                        Open Delete DataSet
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                {deleteModalVisible && table && (
                    <DeleteDatasetModal
                        showModal={deleteModalVisible}
                        handleModalClose={() => setDeleteModalVisible(false)}
                        tableName={table}
                        isDeleteDataSet={true}
                        isDateAvailable={dateAvailable}
                    />
                )}
            </div>
        </>
    )
};
export default DeleteDataSet;