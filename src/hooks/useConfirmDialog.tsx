import { ReactNode, useCallback, useState } from "react";

import { DialogContentProps } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";

interface IConfig {
  opened: boolean;
  title: ReactNode;
  content: ReactNode;
  type: "danger" | "warning" | "default";
  onConfirm: () => void;
  confirmText?: string;
  onCancel: () => void;
  cancelText?: string;
}

interface IConfirmDialog extends DialogContentProps {
  loading?: boolean;
}

const initConfig: IConfig = {
  opened: false,
  title: "",
  content: "",
  type: "danger",
  onConfirm: () => {},
  onCancel: () => {},
};

const buttonClassName = {
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  warning: "bg-warning text-warning-foreground hover:bg-warning/90",
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
};

export const useConfirmDialog = () => {
  const [config, setConfig] = useState<IConfig>(initConfig);

  const {
    opened,
    title,
    content,
    type,
    onConfirm,
    confirmText,
    onCancel,
    cancelText,
  } = config;

  const confirmDialog = useCallback(
    (config: Omit<IConfig, "opened">) => {
      setConfig({ ...config, opened: true });
    },
    [setConfig],
  );

  const onCloseConfirm = useCallback(() => {
    setConfig({ ...config, opened: false });
    onCancel?.();
  }, [config, onCancel]);

  const ConfirmDialog = useCallback(
    ({ loading, ...rest }: IConfirmDialog) => {
      return (
        <Dialog open={opened} onOpenChange={onCloseConfirm}>
          <DialogContent
            className="sm:max-w-screen-xs"
            onPointerDownOutside={(e) => {
              loading && e.preventDefault();
            }}
            onInteractOutside={(e) => {
              loading && e.preventDefault();
            }}
            {...rest}
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div>
              {typeof content === "string" ? (
                <Typography>{content}</Typography>
              ) : (
                content
              )}
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                variant="outline"
                disabled={loading}
                onClick={onCloseConfirm}
              >
                {cancelText || "Cancel"}
              </Button>
              <Button
                loading={loading}
                className={buttonClassName[type]}
                onClick={() => {
                  onConfirm();

                  if (loading === undefined) {
                    onCloseConfirm();
                  }
                }}
                variant="default"
              >
                {confirmText || "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    },
    [
      cancelText,
      confirmText,
      content,
      onCloseConfirm,
      onConfirm,
      opened,
      title,
      type,
    ],
  );

  return {
    confirmDialog,
    onCloseConfirm,
    ConfirmDialog,
  };
};
