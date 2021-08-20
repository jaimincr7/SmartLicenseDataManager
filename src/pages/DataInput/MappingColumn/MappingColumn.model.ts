export interface IMappingColumnProps {
  saveMapping: (fileName: string, isPublic: boolean) => void;
  fileName: string;
  showModal: boolean;
  handleModalClose: () => void;
}
