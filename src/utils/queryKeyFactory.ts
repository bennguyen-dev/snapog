const generateQueryKey = (name: string) => {
  const key = {
    all: [name] as const,
    lists: () => [...key.all, "list"] as const,
    list: (filters: any) => [...key.lists(), { filters }] as const,
    details: () => [...key.all, "detail"] as const,
    detail: (id: number | string) => [...key.details(), id] as const,
  };
  return key;
};

export default generateQueryKey;
