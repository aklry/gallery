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
                        if (!id.includes('node_modules')) {
                            return
                        }

                        if (isPackage(id, 'vue') || isPackage(id, 'vue-router') || isPackage(id, 'pinia')) {
                            return 'vue-core'
                        }

                        if (isPackage(id, 'pinia-plugin-persistedstate')) {
                            return 'state-libs'
                        }

                        if (
                            isPackage(id, 'echarts') ||
                            isPackage(id, 'echarts-wordcloud') ||
                            isPackage(id, 'vue-echarts')
                        ) {
                            return 'echarts'
                        }

                        if (isPackage(id, 'vue-cropper')) {
                            return 'image-tools'
                        }

                        if (isPackage(id, 'vue-waterfall-plugin-next')) {
                            return 'waterfall'
                        }

                        if (isPackage(id, 'vue3-colorpicker')) {
                            return 'colorpicker'
                        }

                        if (isPackage(id, 'axios') || isPackage(id, 'lodash') || isPackage(id, 'dayjs')) {
                            return 'common-libs'
                        }

                        if (isPackage(id, 'ant-design-vue') || isPackage(id, '@ant-design/icons-vue')) {
                            return 'ant-design'
                        }

                        return 'vendor'
                    }
                }
            }
        }
    }
})
