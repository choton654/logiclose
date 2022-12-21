import { gcpUploads, handleMulter } from "../middlewares/upload.middleware.js";
import { serverErrorResponse, successResponse, handle304 } from "../utils/response.js"

export const uploadFile = async (req, res) => {
    try {
        await handleMulter(req, res)
        const [gcpErr, images] = await gcpUploads(req)
        if (gcpErr) {
            return serverErrorResponse(res, gcpErr.message)
        }
        return successResponse(res, images, 'File upload successfull')
    } catch (error) {
        console.log('error', error.message);
        handle304(error, res);
        serverErrorResponse(res, error.message);
    }
}