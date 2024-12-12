import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks";
import { IResponse } from "@/lib/type";

export const useCallAction = <T, E = object, B = object>({
  action,
  handleError,
  handleSuccess,
  nonCallInit = false,
}: {
  action: (body: B) => Promise<IResponse<T>>;
  handleError?: (status: number, message: string) => void;
  handleSuccess?: (message: string, data: T) => void;
  nonCallInit?: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<E>();
  const [letCall, setLetCall] = useState<boolean>(!nonCallInit);
  const { mounted } = useMounted();
  const [body, setBody] = useState<B>();

  const router = useRouter();

  const promiseFunc = (body: B) => {
    setBody(body);
    setLetCall(true);
  };

  const getData = async () => {
    try {
      const response = await action(body!);
      const { status } = response;
      if (status === 200) {
        setData(response.data);
        setError(undefined);
        handleSuccess?.(response.message, response.data);
      } else if (status === 401) {
        router.push("/signin");
      } else if (status === 403) {
        router.replace("/403");
      } else if (status === 404) {
        router.replace("/404");
      } else {
        setError(response.message as E);
        handleError?.(status, response.message || "Internal server error");
      }
    } catch (err: any) {
      handleError?.(500, err.message || "Internal server error");
    } finally {
      setLoading(false);
      setLetCall(false);
    }
  };

  useEffect(() => {
    if (letCall && mounted) {
      setLoading(true);
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letCall, mounted]);

  const handleReset = () => {
    setLoading(false);
    setData(undefined);
    setError(undefined);
    setLetCall(false);
  };

  return {
    handleReset,
    setLetCall,
    loading,
    data,
    error,
    promiseFunc,
  };
};
