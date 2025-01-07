"use client";

import { useRouter } from "next/navigation";

import { Button, ButtonProps } from "@/components/ui/button";
import { useGetCheckoutUrl } from "@/hooks";

interface IProps extends ButtonProps {
  productId: string;
}

export const ButtonBuyNow = ({ children, productId, ...rest }: IProps) => {
  const router = useRouter();
  const { mutate: getCheckoutUrl, isPending: getting } = useGetCheckoutUrl();
  const handleClick = async () => {
    getCheckoutUrl(
      { productId },
      {
        onSuccess: (data) => {
          router.push(data.data.checkoutUrl);
        },
      },
    );
  };
  return (
    <Button {...rest} onClick={handleClick} loading={getting}>
      {children}
    </Button>
  );
};
