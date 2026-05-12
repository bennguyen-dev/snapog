"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useCreateSite } from "@/hooks";

export interface IAddSiteDialogRef {
  open: () => void;
}

const formSchema = z.object({
  domain: z.string().min(1, {
    message: "Domain is required",
  }),
});

const defaultValues = {
  domain: "",
};

export const AddSiteDialog = forwardRef<IAddSiteDialogRef>((props, ref) => {
  const [opened, setOpened] = useState(false);
  const { mutate: createSite, isPending: creating } = useCreateSite();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSave = (formData: z.infer<typeof formSchema>) => {
    createSite(
      {
        domain: formData.domain,
      },
      {
        onSuccess(data) {
          toast({
            variant: "success",
            title: data.message,
          });
          onCancel();
        },
        onError(data) {
          toast({ variant: "destructive", title: data.message });
        },
      },
    );
  };

  const onCancel = () => {
    if (creating) return;
    form.reset(defaultValues);
    setOpened(false);
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpened(true);
    },
  }));

  return (
    <Dialog open={opened} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-screen-xs">
        <Form {...form}>
          <DialogHeader className="mb-4">
            <DialogTitle>Add new site</DialogTitle>
            <DialogDescription>
              This is the website where you want to use the social images on.
            </DialogDescription>
          </DialogHeader>

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input
                    disabled={creating}
                    placeholder="www.yoursite.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" disabled={creating} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={creating}
              disabled={!form.formState.isValid}
              onClick={form.handleSubmit(onSave)}
            >
              Add site
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

AddSiteDialog.displayName = "AddSiteDialog";
