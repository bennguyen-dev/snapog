import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useMounted } from "@/hooks";

export const useCallApi = <T, E = object, B = object>({
  url,
  options,
  handleError,
  handleSuccess,
  nonCallInit = false,
}: {
  url: string;
  options?: RequestInit;
  handleError?: (status: number, message: string) => void;
  handleSuccess?: (message: string, data: T) => void;
  nonCallInit?: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<E>();
  const [letCall, setLetCall] = useState<boolean>(!nonCallInit);
  const { mounted } = useMounted();
  const [body, setBody] = useState<B>();
  const [urlReplace, setUrlReplace] = useState("");

  const router = useRouter();

  const promiseFunc = (body: B, urlReplace?: string) => {
    if (!!urlReplace && urlReplace?.length > 0) {
      setUrlReplace(urlReplace);
    }
    setBody(body);
    setLetCall(true);
  };

  const getData = async () => {
    try {
      const result = await fetch(urlReplace.length > 0 ? urlReplace : url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
        },
        body: !!body ? JSON.stringify(body) : undefined,
      });
      const response = await result.json();
      const { status } = response;
      if (status === 200) {
        setData(response.data);
        setError(undefined);
        if (handleSuccess) {
          handleSuccess(response.message, response.data);
        }
      } else if (status === 400) {
        setError(response.data);
      } else if (status === 401) {
        router.push("/signin");
      } else if (status === 403) {
        router.replace("/403");
      } else if (status === 404) {
        router.replace("/404");
      } else if (handleError && status !== 200) {
        handleError(status, response.message || "Internal server error");
      }
    } catch (err: any) {
      if (handleError) {
        handleError(500, err.message || "Internal server error");
      }
    } finally {
      setLoading(false);
      setLetCall(false);
      setUrlReplace("");
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
