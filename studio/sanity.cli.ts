import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || "production";
const appId = process.env.SANITY_STUDIO_APP_ID;

export default defineCliConfig({
  api: { projectId, dataset },
  ...(appId ? { deployment: { appId } } : {}),
});
