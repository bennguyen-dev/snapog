"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { DURATION_CACHES } from "@/lib/constants";
import { IPageDetail, IUpdatePagesBy } from "@/services/page";

const formSchema = z.object({
  url: z.string(),
  cacheDurationDays: z.string(),
});

interface IProps {
  loading?: boolean;
}

export interface IEditPageDialogRef {
  open: (
    item: IPageDetail | null,
  ) => Promise<Omit<IUpdatePagesBy, "id" | "siteId">>;
  close: () => void;
}

interface IPromiseCallback {
  resolve: (value: Omit<IUpdatePagesBy, "id" | "siteId">) => void;
  reject: (value: null) => void;
}

export const EditPageDialog = forwardRef<IEditPageDialogRef, IProps>(
  (props, ref) => {
    const { loading } = props;

    const [promiseCallback, setPromiseCallback] =
      useState<IPromiseCallback | null>(null);
    const [opened, setOpened] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {},
    });

    const onSave = (data: z.infer<typeof formSchema>) => {
      promiseCallback?.resolve({
        ...data,
        cacheDurationDays: parseInt(data.cacheDurationDays, 10),
      });
    };

    const onCancel = () => {
      promiseCallback?.reject(null);
      setOpened(false);
    };

    useImperativeHandle(ref, () => ({
      open: (item: IPageDetail | null = null) => {
        form.reset({
          url: item?.url,
          cacheDurationDays: item?.cacheDurationDays?.toString(),
        });
        setOpened(true);
        return new Promise((resolve, reject) => {
          setPromiseCallback({ resolve, reject });
        });
      },
      close: () => {
        form.reset({});
        setOpened(false);
        setPromiseCallback(null);
      },
    }));

    return (
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent
          className="sm:max-w-screen-xs"
          onPointerDownOutside={(e) => {
            loading && e.preventDefault();
          }}
          onInteractOutside={(e) => {
            loading && e.preventDefault();
          }}
        >
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
                      disabled={loading}
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
              <Button variant="outline" disabled={loading} onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant="default"
                type="submit"
                loading={loading}
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
