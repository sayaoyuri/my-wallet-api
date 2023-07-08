export default function validateSchema (schema) {
  return (req, res, next) => {
    const { error } = schema.validate(res.locals, { abortEarly: false });
    if(error) return res.status(422).send(error.details.map(e => e.message));

    next();
  };
};