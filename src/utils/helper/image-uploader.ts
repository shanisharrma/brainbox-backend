import { Request } from 'express';
import { cloudinary } from '../../config';
import { AppError } from '../error';
import { StatusCodes } from 'http-status-codes';

interface IUploadOptions {
    folder?: string;
    public_id?: string;
}

interface IImageValidationOptions {
    fieldName: string;
    allowedMimeTypes: string[];
    maxSize: number;
}

class ImageUploader {
    public static async uploadImageToCloudinary(fileBuffer: Buffer, options?: IUploadOptions) {
        return new Promise((resolve, reject) => {
            // * create upload options for file
            const uploadOptions = {
                folder: options?.folder || 'default',
                public_id: options?.public_id || `image-${Date.now()}`,
            };

            // * start the upload stream
            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                // * --> if error -> reject with error
                if (error) {
                    return reject(error);
                }
                // * --> else -> resolve with result
                resolve(result?.secure_url);
            });

            // * end the upload stream
            uploadStream.end(fileBuffer);
        });
    }

    public static validateFile(req: Request, options: IImageValidationOptions) {
        const file = req.file; // Get the uploaded file

        // Check if the file exists
        if (!file) {
            throw new AppError(`${options.fieldName} is required.`, StatusCodes.UNPROCESSABLE_ENTITY);
        }

        // Check for valid MIME type
        if (!options.allowedMimeTypes.includes(file.mimetype)) {
            throw new AppError(
                `Only ${options.allowedMimeTypes.join(', ')} formats are allowed.`,
                StatusCodes.UNPROCESSABLE_ENTITY,
            );
        }

        // Check for file size
        if (file.size > options.maxSize) {
            throw new AppError(
                `File size must not exceed ${options.maxSize / (1024 * 1024)}MB.`,
                StatusCodes.UNPROCESSABLE_ENTITY,
            );
        }

        // If all validations pass, return the file object
        return file;
    }
}
export default ImageUploader;
