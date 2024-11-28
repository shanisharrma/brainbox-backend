import { cloudinary } from '../config';
import { AppError } from '../utils/error';
import { StatusCodes } from 'http-status-codes';
import { DeleteApiResponse, UploadApiResponse } from 'cloudinary';

interface IUploadOptions {
    folder?: string;
    public_id?: string;
}

interface IFileValidationOptions {
    fieldName: string;
    allowedMimeTypes: string[];
    maxSize: number;
}

class FileUploaderService {
    public static async uploadFileToCloudinary(
        fileBuffer: Buffer,
        fileType: 'image' | 'video',
        options?: IUploadOptions,
    ): Promise<UploadApiResponse | undefined> {
        return new Promise((resolve, reject) => {
            // * create upload options for file
            const uploadOptions = {
                folder: options?.folder || 'default',
                public_id: options?.public_id || `${fileType}-${Date.now()}`,
                resource_type: fileType,
            };

            // * start the upload file stream
            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                // * --> if error -> reject with error
                if (error) {
                    return reject(error);
                }
                // * --> else -> resolve with result
                resolve(result);
            });

            // * end the upload stream
            uploadStream.end(fileBuffer);
        });
    }

    public static async uploadImageToCloudinary(
        fileBuffer: Buffer,
        options?: IUploadOptions,
    ): Promise<UploadApiResponse | undefined> {
        return await this.uploadFileToCloudinary(fileBuffer, 'image', options);
    }

    public static async uploadVideoToCloudinary(
        fileBuffer: Buffer,
        options?: IUploadOptions,
    ): Promise<UploadApiResponse | undefined> {
        return await this.uploadFileToCloudinary(fileBuffer, 'video', options);
    }

    public static validateFile(file: Express.Multer.File, options: IFileValidationOptions) {
        // * destructure the options
        const { fieldName, allowedMimeTypes, maxSize } = options;

        // Check if the file exists
        if (!file) {
            throw new AppError(`${fieldName} is required.`, StatusCodes.UNPROCESSABLE_ENTITY);
        }

        // Check for valid MIME type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new AppError(
                `Only ${allowedMimeTypes.join(', ')} formats are allowed.`,
                StatusCodes.UNSUPPORTED_MEDIA_TYPE,
            );
        }

        // Check for file size
        if (file.size > maxSize) {
            throw new AppError(`File size must not exceed ${maxSize / (1024 * 1024)}MB.`, StatusCodes.REQUEST_TOO_LONG);
        }

        // If all validations pass, return the file object
        return file;
    }

    /**
     * Delete a single asset from Cloudinary.
     * @param publicId The public ID of the asset in Cloudinary.
     */
    private static async deleteFromCloudinary(publicId: string): Promise<DeleteApiResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(
                        new AppError('Failed to delete file from cloudinary.', StatusCodes.INTERNAL_SERVER_ERROR),
                    );
                }
                resolve(result);
            });
        });
    }

    /**
     * Delete a single file from Cloudinary.
     * @param publicId The public ID of the asset in Cloudinary.
     * */
    public static async deleteFile(publicId: string): Promise<DeleteApiResponse> {
        return this.deleteFromCloudinary(publicId);
    }

    /**
     * Delete multiple assets from Cloudinary.
     * @param publicIds Array of public IDs of the assets to be deleted.
     */
    private static async deleteMultipleFiles(publicIds: string[]): Promise<DeleteApiResponse[]> {
        const deleteParams = publicIds.map((publicId) => this.deleteFromCloudinary(publicId));
        return Promise.all(deleteParams);
    }

    public static async deleteRelatedFiles(publicIds: string[]): Promise<void> {
        try {
            await this.deleteMultipleFiles(publicIds);
        } catch {
            throw new AppError('Failed to delete related files.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
export default FileUploaderService;
