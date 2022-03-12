import { nodeResolve } from '@rollup/plugin-node-resolve';

export default
[
    {
        input: './imports/bootstrap_import.js',
        output: {
            file: './build/bootstrap.bundle.js',
            format: 'iife',
            name: 'bootstrap',
        },
        plugins: [nodeResolve()],
    },
    {
        input: './imports/firebase_import.js',
        output: {
            file: './build/firebase.bundle.js',
            format: 'es',
            name: 'firebase'
        },
        plugins: [nodeResolve()]
    }
    // {
    //     input: './js/building_select.js',
    //     output: {
    //         file: './build/building_select.bundle.js',
    //         format: 'iife',
    //         name: 'building_select'
    //     },
    //     plugins: [nodeResolve()]
    // }
]