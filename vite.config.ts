import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    // Allow localhost and Replit domains (domains can change per session)
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'disparadorwp.loomadev.com.br',
      process.env.REPLIT_DEV_DOMAIN,
      ...(process.env.REPLIT_DOMAINS || '').split(',').map(s => s.trim())
    ].filter(Boolean)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    }
  }
});
