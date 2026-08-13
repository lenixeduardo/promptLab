import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.promptlabz.app",
  appName: "PromptLabz",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  android: {
    buildOptions: {
      keystorePath: "release.keystore",
      keystoreAlias: "promptlabz",
    },
  },
}

export default config
