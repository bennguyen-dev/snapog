import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IConfirmDialog {
  opened: boolean;
  onOpenChange: (opened: boolean) => void;
  title: ReactNode;
  content: ReactNode;
  type: "warning" | "error" | "info" | "success";
  onConfirm: () => void;
  confirmText?: string;
  onCancel: () => void;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmDialog = ({
  opened,
  onOpenChange,
  title,
  content,
  type,
  onConfirm,
  confirmText,
  onCancel,
  cancelText,
  loading,
}: IConfirmDialog) => {
  const buttonClassName = {
    warning: "bg-warning-100 text-warning-700",
    error: "bg-error-100 text-error-700",
    info: "bg-info-100 text-info-700",
    success: "bg-success-100 text-success-700",
  };

  return (
    <Dialog open={opened} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-screen-xs"
        onPointerDownOutside={(e) => {
          loading && e.preventDefault();
        }}
        onInteractOutside={(e) => {
          loading && e.preventDefault();
        }}
      >
        <DialogHeader className="mb-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button
            loading={loading}
            className={buttonClassName[type]}
            onClick={onConfirm}
            variant="default"
          >
            {confirmText || "Confirm"}
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => {
              onCancel();
              onOpenChange(false);
            }}
          >
            {cancelText || "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
