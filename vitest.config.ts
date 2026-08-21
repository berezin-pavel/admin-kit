import { defineConfig } from "vitest/config"

const alias = { "@": import.meta.dirname }

export default defineConfig({
  test: {
    maxWorkers: 2,
    projects: [
      {
        resolve: { alias },
        test: {
          name: "logic",
          include: ["registry/**/*.test.ts", "app/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        resolve: { alias },
        test: {
          name: "dom",
          include: ["registry/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
})
