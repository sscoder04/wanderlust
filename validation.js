const Joi=require("joi");

module.exports.listingSchema=Joi.object({
    
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required(),
    img:Joi.object({
        url:Joi.string(),
    })
})

module.exports.reviewSchema=Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required(),
})

