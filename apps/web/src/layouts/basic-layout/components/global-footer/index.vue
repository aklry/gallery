<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
    <footer class="w-full py-4 text-center text-sm text-gray-400">
        <a href="http://docs.aklry.com" target="_blank" class="hover:text-blue-500 transition-colors duration-300">
            Copyright &copy; aklry {{ currentYear }}
        </a>
    </footer>
</template>

<style scoped></style>
