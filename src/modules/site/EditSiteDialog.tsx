"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Site } from "@prisma/client";
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
import { toast } from "@/components/ui/use-toast";
import { DURATION_CACHES } from "@/constants";
import { useUpdateSiteById } from "@/hooks";

const formSchema = z.object({
  id: z.string(),
  domain: z.string(),
  cacheDurationDays: z.string(),
  overridePage: z.boolean(),
});

export interface IEditSiteDialogRef {
  open: (item: Site) => void;
}

export const EditSiteDialog = forwardRef<IEditSiteDialogRef>((props, ref) => {
  const [opened, setOpened] = useState(false);
  const { mutate: updateSite, isPending: updating } = useUpdateSiteById();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSave = (formData: z.infer<typeof formSchema>) => {
    updateSite(
      {
        id: formData.id,
        overridePage: formData.overridePage,
        cacheDurationDays: formData.cacheDurationDays
          ? parseInt(formData.cacheDurationDays, 10)
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
    open: (item: Site) => {
      form.reset({
        id: item?.id,
        domain: item?.domain,
        cacheDurationDays: item?.cacheDurationDays?.toString() || "",
        overridePage: false,
      });
      setOpened(true);
    },
  }));

  return (
    <Dialog open={opened} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-screen-xs">
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
          <FormField
            control={form.control}
            name="overridePage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    disabled={updating}
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
});

EditSiteDialog.displayName = "EditSiteDialog";
