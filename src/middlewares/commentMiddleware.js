const requestValidation = (Schema) => {
    return (req, res, next) => {
        const validation = Schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            return res
                .status(422)
                .send(validation.error.details.map((err) => err.message));
        }
        next();
    };
};

export { requestValidation };
