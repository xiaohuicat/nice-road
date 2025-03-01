// build.js
const { build } = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')

build({
  entryPoints: ['./src/index.js'],
  outfile: './dist/nice-road.js',
  bundle: true,
  platform: 'node',
  minify: true,                     // 压缩代码
  external: ['http', 'fs', 'path'], // 列出核心模块
  plugins: [
    nodeExternalsPlugin(),
  ],
}).catch(() => process.exit(1));