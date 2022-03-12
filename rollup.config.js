import { nodeResolve } from '@rollup/plugin-node-resolve';

export default
[
    {
        input: './bootstrap_import.js',
        output: {
            file: './build/bootstrap_import.js',
            format: 'iife',
            name: 'bootstrap_import'
        },
        plugins: [nodeResolve()]
    },
    {
        input: './firestore_import.js',
        output: {
            file: './build/firestore_import.js',
            format: 'iife',
            name: 'firestore_import'
        },
        plugins: [nodeResolve()]
    }
    // {
    //     input: './js/building_select.js',
    //     output: {
    //         file: './build/building_select.js',
    //         format: 'iife',
    //         name: 'building_select'
    //     },
    //     plugins: [nodeResolve()]
    // }
]