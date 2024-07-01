"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DURATION_CACHES } from "@/lib/constants";
import { ISiteDetail, IUpdateSiteBy } from "@/sevices/site";

const formSchema = z.object({
  domain: z.string(),
  cacheDurationDays: z.string(),
  overridePage: z.boolean(),
});

interface IProps {
  loading?: boolean;
}

export interface IEditSiteDialogRef {
  open: (item: ISiteDetail | null) => Promise<Omit<IUpdateSiteBy, "id">>;
  close: () => void;
}

interface IPromiseCallback {
  resolve: (value: Omit<IUpdateSiteBy, "id">) => void;
  reject: (value: null) => void;
}

export const EditSiteDialog = forwardRef<IEditSiteDialogRef, IProps>(
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
      open: (item: ISiteDetail | null = null) => {
        form.reset({
          domain: item?.domain,
          cacheDurationDays: item?.cacheDurationDays?.toString(),
          overridePage: false,
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
              <DialogTitle>{form.getValues("domain")}</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="cacheDurationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cache duration (days)</FormLabel>
                  <FormControl>
                    <Select
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
            <FormField
              control={form.control}
              name="overridePage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        Override for all pages
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="icon cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                                <li>
                                  If turned on, the settings will be applied to
                                  all pages includes all customized pages.
                                </li>
                                <li>
                                  If turned off, this parameter will apply to
                                  pages created later.
                                </li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormLabel>
                  </div>
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

EditSiteDialog.displayName = "EditSiteDialog";
