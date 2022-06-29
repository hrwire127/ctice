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
        config.resolve.alias = {
            ...config.resolve.alias,
            '@mui/styled-engine': '@mui/styled-engine-sc',
        };
        return config
    }, devIndicators: {
        buildActivity: false
    },
    images: {
        domains: [`https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1654542329/ctice`],
    },
}