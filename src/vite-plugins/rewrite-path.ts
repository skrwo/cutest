import type { PluginOption } from "vite"
import { access } from "fs/promises"
import { resolve } from "path"

export default function rewritePath(): PluginOption {
    return {
        name: "rewrite-pages-path",
        enforce: "post",
        generateBundle(options, bundle) {
            Object.values(bundle).forEach((file) => {
                if (file.fileName.includes("src/pages/") && file.fileName.endsWith("html")) {
                    const newFilename = file.fileName.replace("src/pages/", "")
                    file.fileName = newFilename
                }
            })
        },
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url && !req.url.includes("/src/") && !req.url.includes(".")) {
                    // console.log(req.url)
                    const host = `http://${process.env.HOST ?? "localhost"}`
                    const url = new URL(`${host}${req.url}`)
                    const path = `../../../src/pages/${url.pathname.slice(1) || "index"}.html`
                    try {
                        const filepath = resolve(__dirname, path.slice(1))
                        // console.log(filepath)
                        await access(filepath)
                        url.pathname = path
                        req.url = url.toString().replace(host, "")
                    } catch {}
                    // console.log(req.url)
                } else {
                    // console.log("else url", req.url)
                }
                return next()
            })
        },
    }
}
