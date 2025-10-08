export const validateRequest = async (schema, data) => {
    try {
        const validatedData = await schema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
        return validatedData;
    } catch (err) {
        err.status = 400;
        console.log(err);
        throw err;
    }
};
