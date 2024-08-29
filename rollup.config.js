import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/task.js",
  output: [
    {
      file: "index.cjs",
      format: "cjs", // CommonJS
      exports: "named",
    },
    {
      file: "index.esm.mjs",
      format: "esm", // ESM
    },
  ],
  plugins: [resolve()],
};
