const path = require('path')
 
module.exports = () => {
  return {
    mode: 'production',
    target: ['web', 'es5'],
    resolve: {
      extensions: ['.js', '.ts']
    },
    entry: {
      index: path.join(__dirname, 'index.ts')
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'index.js'
    },
    module: {
      rules: [
        {
          use: [{ loader: 'ts-loader' }],
          test: /\.ts$/
        }
      ]
    }
  }
}