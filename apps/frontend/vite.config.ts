import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, repoRoot, "");
  const apiPort = env.PORT || "4000";
  return {
    // ...
    server: {
      port: 5173,
      proxy: { "/api": `http://localhost:${apiPort}` },
    },
  };
});