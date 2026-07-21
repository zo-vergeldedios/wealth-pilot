import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup, nothing custom.
export default defineConfig({
  plugins: [react()],
});
