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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CACHE_DURATION_DAYS, DURATION_CACHES } from "@/lib/constants";
import { ICreateSite } from "@/services/site";

interface IProps {
  loading?: boolean;
}

export interface IAddSiteDialogRef {
  open: () => Promise<Omit<ICreateSite, "userId">>;
  close: () => void;
}

interface IPromiseCallback {
  resolve: (value: any) => void;
  reject: (value: null) => void;
}

const formSchema = z.object({
  domain: z.string().min(1, {
    message: "Domain is required",
  }),
  cacheDurationDays: z.string(),
});

const defaultValues = {
  domain: "",
  cacheDurationDays: CACHE_DURATION_DAYS.toString(),
};

export const AddSiteDialog = forwardRef<IAddSiteDialogRef, IProps>(
  (props, ref) => {
    const { loading } = props;

    const [promiseCallback, setPromiseCallback] =
      useState<IPromiseCallback | null>(null);
    const [opened, setOpened] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues,
      mode: "onChange",
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

      form.reset(defaultValues);
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        setOpened(true);
        return new Promise((resolve, reject) => {
          setPromiseCallback({ resolve, reject });
        });
      },
      close: () => onCancel(),
    }));

    return (
      <Dialog open={opened} onOpenChange={onCancel}>
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
                      disabled={loading}
                      placeholder="www.yoursite.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                type="submit"
                loading={loading}
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
  },
);

AddSiteDialog.displayName = "AddSiteDialog";
