import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
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
    }
})
