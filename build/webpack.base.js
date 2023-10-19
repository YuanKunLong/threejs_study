const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '../src/index.tsx'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'js/[name].js',
        clean:true, // webpack4需要配置clean-webpack-plugin来删除dist文件 webpack5内置了
        publicPath: '/' // 打包后文件的公共前缀
    },
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/, // 匹配.ts、.tsx文件
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 从下往上执行 先处理ts在处理jsx
                        presets: [
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
                type: "asset", // type选择asset
                parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024, // 小于10kb转base64位
                  }
                },
                generator:{ 
                  filename:'static/images/[name][ext]', // 文件输出目录和命名
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'), // 取定义root节点的模板
            inject: true // 自动注入静态资源
        })
    ],
    resolve: {
        extensions: ['.js', '.tsx', '.ts', '.json'],
        alias: {
            '@src': path.join(__dirname, '../src')
        }
    }
}