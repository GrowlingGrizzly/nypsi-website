export interface BotStatus {
  main: boolean;
  maintenance: boolean;
  clusters: {
    id: number;
    online: boolean;
    responsive: boolean;
    restarting: boolean;
    uptime: number;
    guilds: { id: string; shard: number }[];
    shards: {
      id: number;
      status: "idle" | "connecting" | "resuming" | "ready";
      ping: number;
      lastPing: number;
    }[];
  }[];
  cached: number;
}
