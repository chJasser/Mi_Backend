const yup = require("yup");
const courseValidator = yup.object().shape({
  label: yup.string().min(4).max(15).required().trim(),
  description: yup.string().max(255).required().trim(),
  level: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .default("beginner"),
  languages: yup
    .string()
    .oneOf(["english", "french", "arabic"])
    .default("english"),
  price: yup.number().positive().required(),
  duration: yup.number().positive().required(),
  category: yup
    .string()
    .oneOf([
      "voice",
      "guitar",
      "keyboards",
      "strings",
      "percussions",
      "brass",
      "woodwind",
      "others",
    ])
    .default("others"),
});
const courseUpdateValidator = yup.object().shape({
  label: yup.string().min(4).max(15).trim().notRequired(),
  description: yup.string().max(255).trim().notRequired(),
  level: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .notRequired(),
  languages: yup.string().oneOf(["english", "french", "arabic"]).notRequired(),
  price: yup.number().positive().notRequired(),
  duration: yup.number().positive().notRequired(),
  category: yup
    .string()
    .oneOf([
      "voice",
      "guitar",
      "keyboards",
      "strings",
      "percussions",
      "brass",
      "woodwind",
      "others",
    ])
    .notRequired(),
});
const courseSearchValidator = yup.object().shape({
  label: yup.string().min(4).max(15).trim().notRequired(),
  description: yup.string().max(255).trim().notRequired(),
  level: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .notRequired(),
  languages: yup.string().oneOf(["english", "french", "arabic"]).notRequired(),
  maxprice: yup.number().positive().notRequired(),
  maxduration: yup.number().positive().notRequired(),
  minprice: yup.number().positive().notRequired(),
  minduration: yup.number().positive().notRequired(),
  category: yup
    .string()
    .oneOf([
      "voice",
      "guitar",
      "keyboards",
      "strings",
      "percussions",
      "brass",
      "woodwind",
      "others",
    ])
    .notRequired(),
});
const courseTreeValidator = yup.object().shape({
  price: yup.number().oneOf([1, -1]).notRequired(),
  duration: yup.number().oneOf([1, -1]).notRequired(),
  subscribers: yup.number().oneOf([1, -1]).notRequired(),
});

module.exports = {
  courseValidator,
  courseUpdateValidator,
  courseSearchValidator,
  courseTreeValidator,
};
