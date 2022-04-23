import { nodeResolve } from "@rollup/plugin-node-resolve";

export default
[
    {
        input: "./imports/bootstrap_import.js",
        output: {
            file: "./build/bootstrap.bundle.js",
            format: "iife",
            name: "bootstrap"
        },
        plugins: [nodeResolve()]
    }
];
