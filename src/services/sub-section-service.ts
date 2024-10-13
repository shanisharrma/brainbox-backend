import { StatusCodes } from 'http-status-codes';
import { SubSectionRepository } from '../repositories';
import { ISubSectionRequestBody } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import SectionService from './section-service';
import { FileUploader, Quicker } from '../utils/helper';

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

            if (!sectionWithCourse || sectionWithCourse.course?.instructorId !== instructorId) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }
            // * upload the video to cloudinary
            const uploadedVideo = await FileUploader.uploadVideoToCloudinary(file.buffer, {
                folder: 'courses/videos',
                public_id: Quicker.prepareFileName(`${title}-${Date.now()}`),
            });

            // * create payload for subsection with video details
            const subSectionPayload = {
                title,
                description,
                duration: uploadedVideo!.duration,
                videoUrl: uploadedVideo!.secure_url,
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
}

export default SubSectionService;
