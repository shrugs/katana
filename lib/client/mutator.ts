export const mutator = async <T extends Record<string, any>>(
  input: RequestInfo,
  body?: Record<string, any>,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${input}?${new URLSearchParams(body)}`, {
    method: 'POST',
    ...(body && {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    ...options,
  });
  const data = await response.json();
  if (response.status >= 400) throw new Error(data.message);
  return data;
};
