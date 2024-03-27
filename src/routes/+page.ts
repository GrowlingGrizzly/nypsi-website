export const config = {
  runtime: "edge",
  regions: "all",

  isr: {
    expiration: 600,
  },
};

export const load = async ({ fetch }) => {
  const data = fetch("/api/server-count").then(async (r) => r.json());
  return { topgg: data as Promise<{ server_count: number }> };
};
