import { FormInstance } from "antd";

export interface IRenderBIProps {
  seqNumber?: number;
  fileData?: any;
  count: { [key: string]: number };
  handleSave?: (data: any) => void;
  table: string;
  records?: any[];
  setRecords?: (data: any) => void;
  form?: FormInstance<any>;
}
