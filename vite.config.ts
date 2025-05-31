import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
import rewritePath from "./src/vite-plugins/rewrite-path"
import { relative, extname } from "node:path"
import { globSync } from "node:fs"
import { env } from "node:process"

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools(), rewritePath()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                globSync("src/pages/**/*.html").map((file) => [
                    relative("src/pages", file.slice(0, file.length - extname(file).length)),
                    fileURLToPath(new URL(file, import.meta.url)),
                ]),
            ),
        },
    },
    base: env.BASE_URL ?? "./",
})
