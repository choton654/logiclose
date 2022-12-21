export const handleMongoError = (err) => {
    let error = {};
    if (err.code === 11000) {
        // return (error.email = "the email or mobileNo already exists");
        return (error = `${Object.values(
            err.keyValue
        )} is already exists... try another one`);
    }
    if (err.message.includes("validation failed:")) {
        Object.values(err.errors).forEach(({ properties: { path, message } }) => {
            error[path] = message;
        });
    }
    return error;
};