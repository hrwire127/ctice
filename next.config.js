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
        domains: ['res.cloudinary.com'],
    },
}