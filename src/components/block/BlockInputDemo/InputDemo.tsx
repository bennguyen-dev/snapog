"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
import { EyeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallApi } from "@/hooks";
import { getDomainName } from "@/lib/utils";
import { ICreateDemo, ICreateDemoResponse } from "@/sevices/demo";

const formSchema = z.object({
  domain: z.string().min(1, {
    message: "Domain is required",
  }),
});

interface IProps {
  className?: string;
}

export const InputDemo = ({ className }: IProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
    },
    mode: "onChange",
  });

  const { promiseFunc: createDemo, loading: creating } = useCallApi<
    ICreateDemoResponse,
    object,
    ICreateDemo
  >({
    url: `/api/demo`,
    options: {
      method: "POST",
    },
    nonCallInit: true,
    handleSuccess(_, data) {
      router.push(`/demo/${getDomainName(data?.domain)}`);
    },
    handleError(_, message) {
      form.setError("domain", { message });
    },
  });

  const onViewDemo = (data: z.infer<typeof formSchema>) => {
    createDemo({
      domain: data.domain,
    });
  };

  return (
    <Form {...form}>
      <div
        className={cx(
          "mt-8 flex w-full max-w-lg space-x-2 sm:mt-12",
          className,
        )}
      >
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem className="flex-1 text-left">
              <FormControl>
                <Input
                  title="Enter your website URL to see a live demo:"
                  type="text"
                  placeholder="yoursite.com"
                  onKeyUp={(event) => {
                    if (event.key === "Enter") {
                      form.handleSubmit(onViewDemo)();
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          onClick={form.handleSubmit(onViewDemo)}
          icon={<EyeIcon className="icon" />}
          loading={creating}
        >
          View Demo
        </Button>
      </div>
    </Form>
  );
};
