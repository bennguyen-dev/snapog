"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { getDomainName } from "@/lib/utils";

const formSchema = z.object({
  domain: z.string().min(1, {
    message: "Domain is required",
  }),
});

export const InputDemo = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
    },
    mode: "onChange",
  });

  const onViewDemo = (data: z.infer<typeof formSchema>) => {
    router.push(`/demo/${getDomainName(data.domain)}`);
  };

  return (
    <Form {...form}>
      <div className="mt-8 flex w-full max-w-lg space-x-2 sm:mt-12 ">
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem className="flex-1">
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
        >
          View Demo
        </Button>
      </div>
    </Form>
  );
};
