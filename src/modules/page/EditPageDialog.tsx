"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Page } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { DURATION_CACHES } from "@/constants";
import { useUpdatePageById } from "@/hooks";

const formSchema = z.object({
  id: z.string(),
  url: z.string(),
  cacheDurationDays: z.string(),
});

interface IProps {
  siteId: string;
}

export interface IEditPageDialogRef {
  open: (item: Page) => void;
}

export const EditPageDialog = forwardRef<IEditPageDialogRef, IProps>(
  ({ siteId }, ref) => {
    const [opened, setOpened] = useState(false);
    const { mutate: updatePage, isPending: updating } = useUpdatePageById({
      siteId,
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {},
    });

    const onSave = (formData: z.infer<typeof formSchema>) => {
      updatePage(
        {
          id: formData.id,
          cacheDurationDays: formData.cacheDurationDays
            ? Number(formData.cacheDurationDays)
            : undefined,
        },
        {
          onSuccess(data) {
            toast({
              variant: "success",
              title: data.message,
            });
            onClose();
          },
          onError(data) {
            toast({ variant: "destructive", title: data.message });
          },
        },
      );
    };

    const onClose = () => {
      if (updating) return;
      form.reset({});
      setOpened(false);
    };

    useImperativeHandle(ref, () => ({
      open: (item: Page) => {
        form.reset({
          id: item.id,
          url: item.url,
          cacheDurationDays: item?.cacheDurationDays?.toString() || "",
        });
        setOpened(true);
      },
    }));

    return (
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent className="sm:max-w-screen-xs">
          <Form {...form}>
            <DialogHeader className="mb-4">
              <DialogTitle>{form.getValues("url")}</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="cacheDurationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cache duration (days)</FormLabel>
                  <FormControl>
                    <Select
                      disabled={updating}
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Cache duration (days)" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_CACHES.map((item) => {
                          return (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" disabled={updating} onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                loading={updating}
                onClick={form.handleSubmit(onSave)}
                disabled={!form.formState.isDirty}
              >
                Save
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);

EditPageDialog.displayName = "EditPageDialog";
