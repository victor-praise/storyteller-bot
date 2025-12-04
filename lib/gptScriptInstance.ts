import { GPTScript } from "@gptscript-ai/gptscript";

import fs from "fs";

console.log("Server process env GPTSCRIPT_BIN:", process.env.GPTSCRIPT_BIN);
try {
  const { execSync } = require("child_process");
  const v = execSync("gptscript --version", { stdio: "pipe" }).toString();
  console.log("gptscript --version (from server process):", v);
} catch (e) {
  console.error("Failed to spawn gptscript from server process:", e);
}

const g = new GPTScript({
    APIKey: process.env.OPENAI_API_KEY,
});

export default g;