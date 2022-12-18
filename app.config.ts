import 'dotenv/config';
export default {
  expo: {
    scheme: "wmw",
    name: "eaglet",
    slug: "eaglet",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
       "bundleIdentifier": "aragonEaglet",
      "supportsTablet": true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      alchemyKeyGoerli: process.env.ALCHEMY_KEY_GOERLI,
      alchemyKeyMainnet: process.env.ALCHEMY_KEY_MAINNET,
      eas: {
        projectId: "66d4a070-1838-4911-9b7f-56464c802524"
      }
    }
  }
}
