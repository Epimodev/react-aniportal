const path = require('path')

const projectRoot = path.resolve(__dirname, '../');

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: [
      'node_modules',
      projectRoot,
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ]
  },
};
