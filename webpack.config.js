const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  context: process.cwd(),
  entry: {
    start: ["./src/start.ts"],
    configureCampaign: ["./src/configureCampaign/index.ts"]
  },
  output: {
    path: path.join(process.cwd(), "dist"),
    filename: "[name].js"
  },
  node: {
    fs: "empty"
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|txt)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader",
            options: {
              name(file) {
                if (process.env.NODE_ENV === "development") {
                  return "[path][name].[ext]";
                }

                return "[contenthash].[ext]";
              }
            }
          }
        ]
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              allowTsInNodeModules: true
            }
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "bitbox-sdk": {
      "lib/Address": "Address",
      "lib/ECPair": "ECPair",
      "lib/Mnemonic": "Mnemonic"
    },
    lib4js: {
      configure: "configure",
      getLogger: "getLogger"
    }
  },
  plugins: [new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/])]
};
