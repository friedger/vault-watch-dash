import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Stacks blockchain libraries (large)
          'stacks-vendor': [
            '@stacks/connect',
            '@stacks/network',
            '@stacks/transactions'
          ],
          
          // Radix UI components (split into groups)
          'radix-ui-core': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-slot'
          ],
          'radix-ui-extended': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-menubar'
          ],
          
          // Chart library (only used in specific routes)
          'charts': ['recharts'],
          
          // Form libraries
          'forms': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // Query library
          'query': ['@tanstack/react-query']
        }
      }
    },
    // Set chunk size warning limit higher to avoid noise
    chunkSizeWarningLimit: 600,
  },
}));
