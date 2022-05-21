module.exports = {
    webpack: (config, options) =>
    {
        config.module.rules.push({
            test: /\.pdf$/i,
            type: 'asset/source',
        })
        return config
    }, devIndicators: {
        buildActivity: false
    },
    images: {
        domains: ['res.cloudinary.com'],
    },
}