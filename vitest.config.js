import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: 'tests/**.test.ts',
    threads: false,
    environment: 'node',
    globals: false,
    watch: false
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      cdk: fileURLToPath(new URL('./cdk', import.meta.url))
    }
  }
})
