import { ReactNode, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface IConfig {
  opened: boolean;
  title: ReactNode;
  content: ReactNode;
  type: "warning" | "error" | "info" | "success";
  onConfirm: () => void;
  confirmText?: string;
  onCancel: () => void;
  cancelText?: string;
}

const initConfig: IConfig = {
  opened: false,
  title: "",
  content: "",
  type: "warning",
  onConfirm: () => {},
  confirmText: "Confirm",
  onCancel: () => {},
  cancelText: "Cancel",
};

export const useConfirmDialog = () => {
  const [config, setConfig] = useState<IConfig>(initConfig);

  const onOpenConfirm = () => setConfig({ ...config, opened: true });
  const onCloseConfirm = () => setConfig({ ...config, opened: false });

  const ConfirmModal = ({ loading }: { loading?: boolean }) => (
    <ConfirmDialog
      onOpenChange={onCloseConfirm}
      loading={loading}
      {...config}
    />
  );

  return { setConfig, onOpenConfirm, onCloseConfirm, ConfirmModal };
};
