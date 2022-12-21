export const successResponse = (res, data, message) => {
    return res.status(200).json({
        code: 200,
        data: data,
        message: message
    })
}

export const serverErrorResponse = (res, message) => {
    return res.status(500).json({
        code: 500,
        message: message
    })
}

export const badRequestResponse = (res, message) => {
    return res.status(400).json({
        code: 400,
        message: message
    })
}

export const unauthorizedResponse = (res, message) => {
    return res.status(401).json({
        code: 401,
        message: message
    })
}

export const forbiddenResponse = (res, message) => {
    return res.status(403).json({
        code: 403,
        message: message
    })
}

export const notFoundResponse = (res, message) => {
    return res.status(404).json({
        code: 404,
        message: message
    })
}

export const handle304 = (error, res) => {
    if (error.message.includes("304")) {
        console.log("304 error received from DB server");
        return res.status(304).send(`Request failed with status code: 304`);
    }
}