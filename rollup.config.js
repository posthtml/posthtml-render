import { minify } from 'uglify-es'
import cjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const env = !process.env.ROLLUP_WATCH

export default {
  input: 'lib/index.js',
  output: {
    file: 'lib/browser.min.js',
    name: 'render',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    cjs(),
    env && uglify({}, minify)
  ]
}
