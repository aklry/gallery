import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import ViteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import globalExternal from 'rollup-plugin-external-globals'

const globals = globalExternal({
    dayjs: 'dayjs',
    lodash: 'lodash'
})
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ViteCompression({
            threshold: 50 * 1024,
            algorithm: 'gzip'
        }),
        createHtmlPlugin({
            inject: {
                data: {
                    title: '画云间',
                    dayScript: `<script src='https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.11/dayjs.min.js' async></script>`,
                    lodashScript: `<script src='https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js' async></script>`,
                    favicon: '/logo.svg'
                }
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            '@/styles': fileURLToPath(new URL('./src/assets/styles', import.meta.url)),
            '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@/services': fileURLToPath(new URL('./src/services', import.meta.url)),
            '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@/router': fileURLToPath(new URL('./src/router', import.meta.url)),
            '@/store': fileURLToPath(new URL('./src/store', import.meta.url)),
            '@/api': fileURLToPath(new URL('./src/api', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/assets/styles/mixins/index" as mixins;`
            }
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        minify: 'terser',
        cssCodeSplit: true,
        sourcemap: false,
        rollupOptions: {
            output: {
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                entryFileNames: 'js/entry-[hash].js',
                manualChunks: (id: string) => {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                    return 'index'
                }
            },
            external: ['dayjs', 'lodash'],
            plugins: [globals]
        }
    }
})
