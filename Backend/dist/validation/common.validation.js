"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateOrder = exports.validateId = exports.validateCategory = exports.userInfo = void 0;
var _joi = _interopRequireDefault(require("joi"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// export const validRequiredString = (string) => {
//   const Schema = joi.object({
//     string: joi.string().required(),
//   });

//   return Schema.validateAsync(string);
// };

const validateId = id => {
  const Schema = _joi.default.object({
    _id: _joi.default.string().required()
  });
  return Schema.validateAsync(id);
};
exports.validateId = validateId;
const validateCategory = category => {
  const Schema = _joi.default.object({
    category: _joi.default.string().required()
  });
  return Schema.validateAsync(id);
};
exports.validateCategory = validateCategory;
const userInfo = userData => {
  const schema = join.object({
    _id: _joi.default.string().required(),
    password: _joi.default.string().pattern(new RegExp("[a-zA-Z0-9]{3,30}$"))
  });
  return schema.validateAsync(userData);
};
exports.userInfo = userInfo;
const validateOrder = order => {
  const schema = _joi.default.object({
    razorpay_payment_id: _joi.default.string().required()
  });
  return schema.validateAsync(order);
};
exports.validateOrder = validateOrder;