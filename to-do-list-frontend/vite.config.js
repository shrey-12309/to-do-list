import { resolve } from "path";

export default {
  root: resolve(__dirname),
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        signup: resolve(__dirname, "src/pages/signup.html"),
        login: resolve(__dirname, "src/pages/login.html"),
        otp: resolve(__dirname, "src/pages/otp.html"),
      },
    },
  },
  server: {
    port: 5178,
  },
};
