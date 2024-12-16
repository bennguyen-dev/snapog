"use client";

import { useState } from "react";

import { Clipboard, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useConfirmDialog, useRegenerateApiKey } from "@/hooks";

export const InputPublicApiKey = () => {
  const { data: session } = useSession();
  const [show, setShow] = useState<boolean>(false);

  const {
    confirmDialog: openConfirmGenerate,
    onCloseConfirm: onCloseConfirmGenerate,
    ConfirmDialog: ConfirmGenerateDialog,
  } = useConfirmDialog();
  const { mutate: regenerate, isPending: generating } = useRegenerateApiKey();

  const handleCopy = () => {
    navigator.clipboard.writeText(session?.user?.apiKey || "");
    toast({
      variant: "success",
      title: "Copied to clipboard",
    });
  };

  const handleGenerate = () => {
    openConfirmGenerate({
      title: "Generate a new API key",
      content:
        "This action cannot be undone. You will lose access to the API with the current API key immediately and you will need to change it to the new one.",
      type: "danger",
      onConfirm() {
        regenerate(
          {},
          {
            onSuccess(data) {
              toast({
                variant: "success",
                title: data.message,
              });
              onCloseConfirmGenerate();
            },
            onError(data) {
              toast({
                variant: "destructive",
                title: data.message,
              });
            },
          },
        );
      },
      confirmText: "Regenerate",
      onCancel() {},
    });
  };

  return (
    <div className="flex max-w-screen-md items-center gap-2 max-md:flex-col">
      <div className="flex w-full flex-1 items-center space-x-2">
        <Input
          type={show ? "text" : "password"}
          readOnly
          value={session?.user?.apiKey || ""}
        />

        <Button variant="outline" onClick={() => setShow(!show)}>
          {show ? <EyeOff /> : <Eye />}
        </Button>
        <Button variant="outline" onClick={handleCopy}>
          <Clipboard />
        </Button>
      </div>
      <Button
        className="max-md:w-full"
        variant="destructive"
        onClick={handleGenerate}
      >
        Regenerate
      </Button>

      <ConfirmGenerateDialog loading={generating} />
    </div>
  );
};
