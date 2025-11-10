import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import ViteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    return {
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
        esbuild: {
            drop: mode === 'production' ? ['console', 'debugger'] : []
        },
        build: {
            sourcemap: mode === 'production' ? false : true,
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                    entryFileNames: 'js/entry-[hash].js',
                    manualChunks: (id: string) => {
                        if (id.includes('node_modules')) {
                            if (id.includes('echarts')) {
                                return 'echarts'
                            }
                            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                                return 'vue-libs'
                            }
                            if (id.includes('axios') || id.includes('lodash') || id.includes('dayjs')) {
                                return 'common-libs'
                            }
                            return 'vendor'
                        }
                    }
                }
            }
        }
    }
})
