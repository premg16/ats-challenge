/** @type {import('next').NextConfig} */

import NextBundleAnalyzer from "@next/bundle-analyzer";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
    },
    typescript: {
        tsconfigPath: "tsconfig.json",
    },
    bundlePagesRouterDependencies: true,
    reactStrictMode: false,
    transpilePackages: ["lucide-react"],
    experimental: {
        optimizePackageImports: ["lucide-react"],
        serverActions: {
            bodySizeLimit: "5mb",
            allowedOrigins: ["*"],
        },
        staleTimes: {
            dynamic: 30,
            static: 180,
        },
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.js",
                },
            },
            resolveAlias: {
                underscore: "lodash",
                mocha: { browser: "mocha/browser-entry.js" },
            },
            resolveExtensions: [
                ".mdx",
                ".tsx",
                ".ts",
                ".jsx",
                ".js",
                ".mjs",
                ".json",
            ],
        },
    },
    eslint: {
        // ignoreDuringBuilds: true,
        dirs: ["src"],
    },
};

const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
