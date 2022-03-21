export interface IMainTable {
  setSelectedId?: (id: number) => void;
  job_id?: number;
  tableButtons?: () => JSX.Element;
}
