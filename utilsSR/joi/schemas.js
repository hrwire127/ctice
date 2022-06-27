const BaseJoi = require("joi")
const sanitizeHtml = require('sanitize-html');

const extension = (joi) =>
({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules:
    {
        escapeHTML:
        {
            validate(value, helpers)
            {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(require('@joi/date')).extend(extension)

const declarationSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.object({
        blocks: Joi.array().items(Joi.object().keys({
            key: Joi.string().required(),
            text: Joi.string().required().allow('').escapeHTML(),
            type: Joi.string().required(),
            depth: Joi.number().required(),
            inlineStyleRanges: Joi.array().required(),
            entityRanges: Joi.array().required(),
            data: Joi.object().required()
        })),
        entityMap: Joi.object().required()
    }).required(),
    file: Joi.string(),
    tags: Joi.array().items(Joi.any().required())
})

const reguserSchema = Joi.object({
    confirmationCode: Joi.string().required().escapeHTML(),
    password: Joi.string().required().escapeHTML(),
    profile: Joi.string().escapeHTML(),
    location: Joi.object({
        name: Joi.string().required().escapeHTML(),
        lat: Joi.number().required(),
        long: Joi.number().required()
    }),
    bio: Joi.object({
        blocks: Joi.array().items(Joi.object().keys({
            key: Joi.string().required().escapeHTML(),
            text: Joi.string().required().allow('').escapeHTML(),
            type: Joi.string().required().escapeHTML(),
            depth: Joi.number().required(),
            inlineStyleRanges: Joi.array().required(),
            entityRanges: Joi.array().required(),
            data: Joi.object().required()
        })),
        entityMap: Joi.object().required()
    }),
    connections: Joi.object({
        facebook: Joi.string().allow('').escapeHTML(),
        linkedin: Joi.string().allow('').escapeHTML(),
        twitter: Joi.string().allow('').escapeHTML()
    })
})

const pendingSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    email: Joi.string().required().escapeHTML()
})

const loguserSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    password: Joi.string().required().escapeHTML(),
    remember: Joi.boolean().required()
})

const changeSchema = Joi.object({
    username: Joi.string().escapeHTML(),
    profile: Joi.string().escapeHTML(),
    location: Joi.object({
        name: Joi.string().required().escapeHTML(),
        lat: Joi.number().required(),
        long: Joi.number().required()
    }),
    bio: Joi.object({
        blocks: Joi.array().items(Joi.object().keys({
            key: Joi.string().required().escapeHTML(),
            text: Joi.string().required().allow('').escapeHTML(),
            type: Joi.string().required().escapeHTML(),
            depth: Joi.number().required(),
            inlineStyleRanges: Joi.array().required(),
            entityRanges: Joi.array().required(),
            data: Joi.object().required()
        })),
        entityMap: Joi.object().required()
    }),
    connections: Joi.object({
        facebook: Joi.string().allow('').escapeHTML(),
        linkedin: Joi.string().allow('').escapeHTML(),
        twitter: Joi.string().allow('').escapeHTML()
    })
})

const commentSchema = Joi.object({
    content: Joi.object({
        blocks: Joi.array().items(Joi.object().keys({
            key: Joi.string().required().escapeHTML(),
            text: Joi.string().required().allow('').escapeHTML(),
            type: Joi.string().required().escapeHTML(),
            depth: Joi.number().required(),
            inlineStyleRanges: Joi.array().required(),
            entityRanges: Joi.array().required(),
            data: Joi.object().required()
        })),
        entityMap: Joi.object().required()
    }).required(),
    date: Joi.date().iso()
})

const gallerySchema = Joi.array().items(
    Joi.object().keys({
        name: Joi.string().required().escapeHTML(),
        data: Joi.any().required(),
        size: Joi.number().required(),
        encoding: Joi.string().required().escapeHTML(),
        tempFilePath: Joi.string().required().escapeHTML(),
        truncated: Joi.boolean().required(),
        mimetype: Joi.string().required().escapeHTML(),
        md5: Joi.string().required().escapeHTML(),
        mv: Joi.function().required()
    }))

const bannerSchema = Joi.object({
    content: Joi.string().required(),
    date: Joi.date().iso()
})

const notificationSchema = Joi.object({
    content: Joi.string().required(),
    banner: Joi.string(),
    date: Joi.date().iso()
})


const tagSchema = Joi.object({
    content: Joi.string().required().escapeHTML(),
})

module.exports = {
    declarationSchema, reguserSchema, pendingSchema, loguserSchema, changeSchema,
    commentSchema, gallerySchema, bannerSchema, notificationSchema, tagSchema
}