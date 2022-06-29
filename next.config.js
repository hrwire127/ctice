module.exports = {
    webpack: (config, options) =>
    {
        config.module.rules.push({
            test: /\.pdf$/i,
            type: 'asset/source',
        })
        // config.module.rules.push({
        //     test: /plugin\.css$/,
        //     use:['style-loader','css-loader']
        // })
        return config
    }, devIndicators: {
        buildActivity: false
    },
    images: {
        domains: [`https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1654542329/ctice`],
    },
    reactStrictMode: true,
    compiler: {
      emotion: true,
    },
}