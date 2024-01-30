const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
        },
      },
      plugins: [
        new webpack.DefinePlugin({
          process: {
            browser: true,
            env: {
              NODE_ENV: '"development"',
              FUNCTIONS_BASE: '"http://127.0.0.1:5001/microrevolutions-a6bcf/europe-west1"',
            },
          },
        }),
      ],
    },
  },
  plugins: [],
};
