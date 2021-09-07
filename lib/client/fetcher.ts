export const fetcher = async (input: RequestInfo, body?: Record<string, any>) => {
  const response = await fetch(`${input}?${new URLSearchParams(body)}`);
  const data = await response.json();
  if (response.status >= 400) throw new Error(data.message);
  return data;
};
