export const fetcher = (input: RequestInfo, body?: Record<string, any>) =>
  fetch(`${input}?${new URLSearchParams(body)}`).then((res) => res.json());
