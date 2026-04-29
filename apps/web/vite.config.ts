import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import ViteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

const isPackage = (id: string, pkg: string) => id.includes(`/node_modules/${pkg}/`)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            vue(),
            Components({
                dts: false,
                resolvers: [
                    AntDesignVueResolver({
                        importStyle: false
                    })
                ]
            }),
            ViteCompression({
                threshold: 50 * 1024,
                algorithm: 'gzip'
            }),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: '映刻',
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
                        const normalizedId = id.replace(/\\/g, '/')

                        if (!normalizedId.includes('node_modules')) {
                            return
                        }

                        // Keep third-party CSS out of JS manual chunks, otherwise
                        // a tiny reset.css import can pull an entire UI library into
                        // the entry preload graph.
                        if (normalizedId.endsWith('.css')) {
                            return
                        }

                        if (
                            isPackage(normalizedId, 'vue') ||
                            isPackage(normalizedId, 'vue-router') ||
                            isPackage(normalizedId, 'pinia')
                        ) {
                            return 'vue-core'
                        }

                        if (isPackage(normalizedId, 'pinia-plugin-persistedstate')) {
                            return 'state-libs'
                        }

                        if (
                            isPackage(normalizedId, 'echarts') ||
                            isPackage(normalizedId, 'echarts-wordcloud') ||
                            isPackage(normalizedId, 'vue-echarts')
                        ) {
                            return 'echarts'
                        }

                        if (isPackage(normalizedId, 'vue-cropper')) {
                            return 'image-tools'
                        }

                        if (isPackage(normalizedId, 'vue-waterfall-plugin-next')) {
                            return 'waterfall'
                        }

                        if (isPackage(normalizedId, 'vue3-colorpicker')) {
                            return 'colorpicker'
                        }

                        if (
                            isPackage(normalizedId, 'axios') ||
                            isPackage(normalizedId, 'lodash') ||
                            isPackage(normalizedId, 'dayjs')
                        ) {
                            return 'common-libs'
                        }

                        if (
                            isPackage(normalizedId, 'ant-design-vue') ||
                            isPackage(normalizedId, '@ant-design/icons-vue')
                        ) {
                            return 'ant-design'
                        }

                        return 'vendor'
                    }
                }
            }
        }
    }
})
