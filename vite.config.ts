/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import dts from "vite-plugin-dts";
import { peerDependencies } from "./package.json";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ add alias for "@/"
    },
  },
  build: {
    target: "es2020",
    lib: {
      entry: "./src/index.ts", // Specifies the entry point for building the library.
      name: "vite-react-ts-button", // Sets the name of the generated library.
      fileName: (format) => `index.${format}.js`, // Generates the output file name based on the format.
      formats: ["cjs", "es"], // Specifies the output formats (CommonJS and ES modules).
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)], // Defines external dependencies for Rollup bundling.
    },
    sourcemap: true, // Generates source maps for debugging.
    emptyOutDir: true, // Clears the output directory before building.
    minify: "esbuild",
  },
  plugins: [
    dts(),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // Compress assets larger than 10KB
      deleteOriginFile: false, // Keep original files
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
    }),
  ], // Uses the 'vite-plugin-dts' plugin for generating TypeScript declaration files (d.ts).
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    exclude: ["node_modules", "**/src/**/*", "**/src/*"],
  },
  css: {
    modules: {
      localsConvention: "camelCase", // or 'dashes' depending on your preference
    },
  },
});
