import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import fs from 'fs'


function copyExtraFiles(): Plugin {
  return {
    name: 'copy-extra-files',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const files = [
        path.resolve(__dirname, 'public/icon.png'),
        path.resolve(__dirname, 'hsq.config.json'),
      ]
      for (const src of files) {
        if (fs.existsSync(src)) {
          const dest = path.join(dist, path.basename(src))
          fs.copyFileSync(src, dest)
          console.log(`  ✓ copied ${path.basename(src)} -> dist/`)
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    copyExtraFiles()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
