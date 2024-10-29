"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "class-variance-authority";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallApi } from "@/hooks";
import { getDomainName } from "@/lib/utils";
import { ICreateDemo, ICreateDemoResponse } from "@/services/demo";
import { IVerifyCaptcha } from "@/services/googleCaptcha";

const formSchema = z.object({
  domain: z.string().min(1, {
    message: "Domain is required",
  }),
});

interface IProps {
  className?: string;
}

interface ICreateDemoPayload extends ICreateDemo, IVerifyCaptcha {}

export const InputDemo = ({ className }: IProps) => {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

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
    ICreateDemoPayload
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

  const onViewDemo = async (data: z.infer<typeof formSchema>) => {
    if (!executeRecaptcha) {
      form.setError("domain", {
        message:
          "Execute recaptcha not available yet likely meaning key not recaptcha key not set",
      });
      return;
    }

    try {
      const gReCaptchaToken = await executeRecaptcha("createDemo");

      createDemo({
        url: data.domain,
        gReCaptchaToken,
      });
    } catch (error) {
      form.setError("domain", {
        message: "Failed to create demo. Please try again.",
      });
    }
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
                  disabled={creating}
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
