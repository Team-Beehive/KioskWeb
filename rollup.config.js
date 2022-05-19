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
    },
    {
        input: "./imports/jquery_ui_import.js",
        output: {
            file: "./build/jquery_ui.bundle.js",
            format: "iife",
            name: "jquery_ui"
        },
        treeshake: false,
        plugins: [nodeResolve()]
    }
];