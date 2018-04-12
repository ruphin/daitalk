import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import { uglifier } from 'uglify-es';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import * as path from 'path';

function getConfig({ name, input, dest, format, uglified = false, transpiled = false }) {
  return {
    input: input,
    output: {
      exports: 'named',
      file: dest,
      format,
      name: name
    },
    plugins: [
      transpiled && resolve(),
      transpiled &&
        commonjs({
          include: 'node_modules/**'
        }),
      transpiled &&
        babel({
          presets: [['env', { modules: false }]],
          plugins: ['transform-runtime'],
          runtimeHelpers: true,
          exclude: 'node_modules/**'
        }),
      uglified &&
        uglify(
          {
            warnings: true,
            toplevel: !transpiled,
            sourceMap: true,
            compress: { passes: 2 },
            mangle: { properties: false },
            keep_classnames: true
          },
          uglifier
        ),
      filesize()
    ].filter(Boolean)
  };
}

const config = [
  getConfig({ name: 'DaiTalk', input: './src/index.js', dest: './index.js', format: 'es', transpiled: false, uglified: false }),
  getConfig({ name: 'DaiWallet', input: 'src/index.js', dest: './index.nomodule.js', format: 'iife', transpiled: false, uglified: false })
];

export default config;
