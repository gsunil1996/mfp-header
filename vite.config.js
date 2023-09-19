import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import packageJson from "./package.json";

export default defineConfig(({ command }) => {
  const isDevelopment = command === "serve";
  return {
    base: isDevelopment
      ? "http://localhost:8080"
      : "https://mfp-header.vercel.app/",
    plugins: [
      react(),
      federation({
        name: "header",
        filename: "remoteEntry.js",
        remotes: {},
        exposes: {
          "./Header": "./src/Header",
        },
        shared: {
          ...packageJson.dependencies, // Access dependencies directly from package.json
          react: {
            singleton: true,
            requiredVersion: packageJson.dependencies.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: packageJson.dependencies["react-dom"],
          },
        },
      }),
    ],
    server: {
      port: 8080,
      proxy: {
        // If you need to proxy requests to another server during development
        // '/api': 'http://localhost:3000',
      },
      // Enable historyApiFallback for client-side routing
      historyApiFallback: true,
    },
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
  };
});
