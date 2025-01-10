"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "lucide-react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateDemo } from "@/hooks";
import { cn, getDomainName } from "@/utils";

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Url is required",
  }),
});

interface IProps {
  className?: string;
}

export const InputDemo = ({ className }: IProps) => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { mutate: createDemo } = useCreateDemo();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
    mode: "onChange",
  });

  const onViewDemo = async (data: z.infer<typeof formSchema>) => {
    if (!executeRecaptcha) {
      form.setError("url", {
        message:
          "Execute recaptcha not available yet likely meaning key not recaptcha key not set",
      });
      return;
    }

    setLoading(true);

    try {
      const gReCaptchaToken = await executeRecaptcha("createDemo");

      createDemo(
        {
          url: data.url,
          gReCaptchaToken,
        },
        {
          onSuccess: (data) => {
            router.push(`/demo/${getDomainName(data?.data?.domain)}`);
          },
          onError: (data) => {
            setLoading(false);
            form.setError("url", {
              message: data?.message,
            });
          },
        },
      );
    } catch (error) {
      setLoading(false);
      form.setError("url", {
        message: "Failed to create demo. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <div className={cn("flex flex-col justify-start", className)}>
        <FormLabel className="mb-1 ml-1 inline text-left text-sm text-muted-foreground">
          Enter your website URL to see a live demo:
        </FormLabel>
        <div className="flex w-full max-w-lg space-x-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="flex-1 text-left">
                <FormControl>
                  <Input
                    className="xl:h-11"
                    title="Enter your website URL to see a live demo:"
                    type="text"
                    placeholder="yoursite.com"
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        form.handleSubmit(onViewDemo)();
                      }
                    }}
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="xl:h-11"
            onClick={form.handleSubmit(onViewDemo)}
            icon={<EyeIcon className="icon" />}
            loading={loading}
          >
            View Demo
          </Button>
        </div>
      </div>
    </Form>
  );
};
