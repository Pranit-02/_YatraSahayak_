import joi from "joi";

// export const validRequiredString = (string) => {
//   const Schema = joi.object({
//     string: joi.string().required(),
//   });

//   return Schema.validateAsync(string);
// };

export const validateId = (id) => {
  const Schema = joi.object({
    _id: joi.string().required(),
  });

  return Schema.validateAsync(id);
};

export const validateCategory = (category) => {
  const Schema = joi.object({
    category: joi.string().required(),
  });

  return Schema.validateAsync(id);
};

export const userInfo = (userData) => {
  const schema = join.object({
    _id: joi.string().required(),
    password: joi.string().pattern(new RegExp("[a-zA-Z0-9]{3,30}$")),
  })
  return schema.validateAsync(userData);
}

export const validateOrder = (order) => {
  const schema = joi.object({
    razorpay_payment_id: joi.string().required(),
  });
  return schema.validateAsync(order);
}