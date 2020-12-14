'use strict';
import buble from 'rollup-plugin-buble';
import clear from 'rollup-plugin-clear';
import commonjs from '@rollup/plugin-commonjs';
import multiEntry from '@rollup/plugin-multi-entry';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'test/integration/**/*.test.ts',
    output: {
        file: 'dist/test-integration.bundle.js',
        format: 'cjs',
        sourcemap: true
    },
    external: ['chai', 'it', 'describe'],
    plugins: [
        clear({ targets: ['dist'] }),
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
        multiEntry(),
        buble()
    ]
};
