import { StatusCodes } from 'http-status-codes';
import { SubSectionRepository } from '../repositories';
import { ISubSectionRequestBody } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import SectionService from './section-service';
import { Quicker } from '../utils/helper';
import FileUploaderService from './file-uploader-service';

class SubSectionService {
    private subSectionRepository: SubSectionRepository;
    private sectionService: SectionService;

    constructor() {
        this.subSectionRepository = new SubSectionRepository();
        this.sectionService = new SectionService();
    }

    public async create(
        sectionId: number,
        instructorId: number,
        file: Express.Multer.File,
        data: ISubSectionRequestBody,
    ) {
        try {
            // * destructure the data
            const { title, description } = data;

            // * check section exists
            const sectionWithCourse = await this.sectionService.getOneWithCourseById(sectionId);
            if (!sectionWithCourse) {
                throw new AppError(ResponseMessage.NOT_FOUND('Section'), StatusCodes.NOT_FOUND);
            }

            // * check Instructor is same as course instructor
            if (!sectionWithCourse || sectionWithCourse.course?.instructorId !== instructorId) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * upload the video to cloudinary
            const uploadedVideo = await FileUploaderService.uploadVideoToCloudinary(file.buffer, {
                folder: 'courses/videos',
                public_id: Quicker.prepareFileName(`${title}-${Date.now()}`),
            });

            if (!uploadedVideo) {
                throw new AppError(ResponseMessage.UPLOAD_FAILED('Video'), StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // * create payload for subsection with video details
            const subSectionPayload = {
                title,
                description,
                duration: uploadedVideo.duration,
                videoUrl: uploadedVideo.secure_url,
                sectionId: sectionWithCourse.id!,
            };

            // * create subsection record inside db
            const subSection = await this.subSectionRepository.create(subSectionPayload);

            // * return subsection response
            return subSection.get({ plain: true });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(
        subSectionId: number,
        sectionId: number,
        instructorId: number,
        file: Express.Multer.File,
        data: Partial<ISubSectionRequestBody>,
    ) {
        try {
            // * destructure the data
            const { title, description } = data;

            // * get subSection with section with course
            const subSectionWithSectionWithCourse =
                await this.subSectionRepository.getWithSectionWithCourseByIdAndSectionId(subSectionId, sectionId);

            // * check subSection exists
            if (!subSectionWithSectionWithCourse) {
                throw new AppError(ResponseMessage.NOT_FOUND('Sub Section'), StatusCodes.NOT_FOUND);
            }

            // * check if instructorId is same with course instructorId
            if (
                !subSectionWithSectionWithCourse.section ||
                !subSectionWithSectionWithCourse.section.course ||
                subSectionWithSectionWithCourse.section.course.instructorId !== instructorId
            ) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * set values to subSection
            subSectionWithSectionWithCourse.title = title || subSectionWithSectionWithCourse.title;
            subSectionWithSectionWithCourse.description = description || subSectionWithSectionWithCourse.description;

            // * check file exists
            if (file) {
                // * validate file
                const validatedFile = FileUploaderService.validateFile(file, {
                    fieldName: file.fieldname,
                    allowedMimeTypes: ['video/mp4', 'video/mkv', 'video/avi'],
                    maxSize: 1024 * 1024 * 100,
                });
                // * if yes --> then add it to the subSectionUpdate payload
                // * if no --> then leave then as it is
                const uploadVideo = await FileUploaderService.uploadVideoToCloudinary(validatedFile.buffer, {
                    folder: 'courses/video',
                    public_id: Quicker.prepareFileName(`${subSectionWithSectionWithCourse.title}-${Date.now()}`),
                });

                if (!uploadVideo) {
                    throw new AppError(ResponseMessage.UPLOAD_FAILED('Video'), StatusCodes.INTERNAL_SERVER_ERROR);
                }

                subSectionWithSectionWithCourse.duration =
                    uploadVideo.duration || subSectionWithSectionWithCourse.duration;
                subSectionWithSectionWithCourse.videoUrl =
                    uploadVideo.secure_url || subSectionWithSectionWithCourse.videoUrl;
            }

            // * update the subSection with subSectionUpdatePayload
            await subSectionWithSectionWithCourse.save();

            // * return seuSection response
            return subSectionWithSectionWithCourse;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async destroy(subSectionId: number, sectionId: number, instructorId: number) {
        try {
            // * get one by subSectionId and sectionId
            const subSectionWithSectionWithCourse =
                await this.subSectionRepository.getWithSectionWithCourseByIdAndSectionId(subSectionId, sectionId);

            // * check subSection with details exists
            if (!subSectionWithSectionWithCourse) {
                throw new AppError(ResponseMessage.NOT_FOUND('Sub Section'), StatusCodes.NOT_FOUND);
            }

            // * check instructor authorized
            if (
                !subSectionWithSectionWithCourse.section ||
                !subSectionWithSectionWithCourse.section.course ||
                subSectionWithSectionWithCourse.section.course.instructorId !== instructorId
            ) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * destroy the subsection
            await subSectionWithSectionWithCourse.destroy();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default SubSectionService;
