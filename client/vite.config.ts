import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import ViteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import globalExternal from 'rollup-plugin-external-globals'

const globals = globalExternal({
    dayjs: 'dayjs',
    echarts: 'echarts',
    lodash: 'lodash',
    vueEcharts: 'vueEcharts',
    echartsWordcloud: 'echartsWordcloud'
})
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ViteCompression({
            threshold: 50 * 1024,
            algorithm: 'brotliCompress'
        }),
        createHtmlPlugin({
            inject: {
                data: {
                    title: '源空间',
                    dayScript: `<script src='https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.11/dayjs.min.js' async></script>`,
                    lodashScript: `<script src='https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js' async></script>`,
                    echartsScript: `<script src='https://cdn.bootcdn.net/ajax/libs/echarts/5.6.0/echarts.min.js' async></script>`,
                    vueEchartsScript: `<script src="https://cdn.bootcdn.net/ajax/libs/vue-echarts/7.0.3/index.min.js"></script>`,
                    echartsWordcloudScript: `<script src="https://cdn.bootcdn.net/ajax/libs/echarts-wordcloud/2.1.0/echarts-wordcloud.min.js"></script>`
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
                        return id.toString().split('node_modules/')[1].split('/')[0].toString()
                    }
                    return 'vendor'
                }
            },
            external: ['dayjs', 'echarts', 'lodash'],
            plugins: [globals]
        }
    }
})
