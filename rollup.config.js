import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
   input: "src/index.ts",
   output: [
      {
         file: "dist/index.cjs.js",
         format: "cjs",
      },
      {
         file: "dist/index.esm.js",
         format: "es",
      },
   ],
   plugins: [typescript({ tsconfig: "./tsconfig.json" })],
   external: ["react", "react-dom"], // if needed
});
