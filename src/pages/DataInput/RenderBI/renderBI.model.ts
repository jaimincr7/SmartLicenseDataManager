import { FormInstance } from 'antd';

export interface IRenderBIProps {
  seqNumber?: number;
  fileData?: any;
  count: { [key: string]: number };
  handleSave?: (data: any) => void;
  table: string;
  date: any;
  records?: any[];
  setRecords?: (data: any) => void;
  form?: FormInstance<any>;
  loading?: boolean;
  setLoading?: (data: boolean) => void;
  setDelimitFlag?: (data: any) => void;
  firstFlag?: boolean;
  setFirstFlag?: (data: boolean) => void;
  hideUnmapped?: boolean;
  withoutUnmappedRecords?: any[];
  setWithoutUnmappedRecords?: (data: any) => void;
  dateChangeFlag?: boolean;
  setDateChangeFlag?: (data: boolean) => void;
  setExpandedRecords?: (data: any) => void;
  expandedRecords?: any;
}
