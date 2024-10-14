import { StatusCodes } from 'http-status-codes';
import { SubSectionRepository } from '../repositories';
import { ISubSectionAttributes, ISubSectionRequestBody, ISubSectionUpdateParams } from '../types';
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
                sectionId: sectionWithCourse.id,
            };

            // * create subsection record inside db
            const subSection = await this.subSectionRepository.create(subSectionPayload);

            // * return subsection response
            return subSection;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(
        subSectionId: number,
        sectionId: number,
        instructorId: number,
        data: Partial<ISubSectionUpdateParams>,
    ) {
        try {
            // * destructure the data
            const { title, description, file } = data;

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

            // * create subSectionUpdate payload
            const subSectionUpdatePayload: ISubSectionAttributes = {
                title: title || subSectionWithSectionWithCourse.title,
                description: description || subSectionWithSectionWithCourse.description,
                sectionId: subSectionWithSectionWithCourse.sectionId,
                videoUrl: subSectionWithSectionWithCourse.videoUrl,
                duration: subSectionWithSectionWithCourse.duration,
            };

            // * check file exists
            if (file) {
                // * if yes --> then add it to the subSectionUpdate payload
                // * if no --> then leave then as it is
                const uploadVideo = await FileUploaderService.uploadVideoToCloudinary(file.buffer, {
                    folder: 'courses/video',
                    public_id: Quicker.prepareFileName(`${subSectionUpdatePayload.title}-${Date.now()}`),
                });

                if (!uploadVideo) {
                    throw new AppError(ResponseMessage.UPLOAD_FAILED('Video'), StatusCodes.INTERNAL_SERVER_ERROR);
                }

                subSectionUpdatePayload.duration = uploadVideo.duration;
                subSectionUpdatePayload.videoUrl = uploadVideo.secure_url;
            }

            // * update the subSection with subSectionUpdatePayload
            const subSection = await this.subSectionRepository.update(subSectionId, subSectionUpdatePayload);

            // * return seuSection response
            return subSection;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default SubSectionService;
