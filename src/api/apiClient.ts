// It helps maintain consistent headers, base URL, and error handling. Returns .json

export const fetchUtil = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const config: RequestInit = { ...defaultOptions, ...options };

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_NODE_ENV === "development"
        ? "http://127.0.0.1:3001/"
        : "https://finstoryapi.frontgr.com/"
    }${url}`,
    config
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
