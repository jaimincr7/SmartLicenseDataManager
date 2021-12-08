import { FormInstance } from "antd";

export interface IRenderBIProps {
  seqNumber?: number;
  fileData?: any;
  count: { [key: string]: number };
  handleSave?: (data: any) => void;
  table: string;
  records?: any[];
  form?: FormInstance<any>;
}
