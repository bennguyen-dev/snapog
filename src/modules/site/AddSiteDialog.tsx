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
import { toast } from "@/components/ui/use-toast";
import { CACHE_DURATION_DAYS, DURATION_CACHES } from "@/constants";
import { useCreateSite } from "@/hooks";

export interface IAddSiteDialogRef {
  open: () => void;
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
        cacheDurationDays: parseInt(formData.cacheDurationDays, 10),
      },
      {
        onSuccess(data) {
          toast({
            variant: "success",
            title: data.message,
          });
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
          <FormField
            control={form.control}
            name="cacheDurationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cache duration (days)</FormLabel>
                <FormControl>
                  <Select
                    disabled={creating}
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
