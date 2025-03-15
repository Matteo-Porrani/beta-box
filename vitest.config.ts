import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    resolve: {
        alias: [
            { find: "@", replacement: "/src" },
        ]
    },
    plugins: [
        vue(),
    ],
    test: {
        globals: true,
        environment: "jsdom",
    }
});

