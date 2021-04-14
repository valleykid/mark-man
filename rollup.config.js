import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: {
    name: 'markMan',
    file: pkg.main,
    format: 'umd',
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    uglify()
  ]
}; 