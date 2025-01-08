import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import * as path from 'path'

export default defineConfig({
  html: {
    template: path.resolve(__dirname, './public/index.html'),
    favicon: './public/favicon.ico',
  },
  server: {
    base: '/find-icon',
		host: '0.0.0.0',
    port: 5200,
  },
  plugins: [pluginReact()]
});
