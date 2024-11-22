import { StatusCodes } from 'http-status-codes';
import { SectionRepository } from '../repositories';
import { ISectionRequestBody } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import CourseService from './course-service';

class SectionService {
    private sectionRepository: SectionRepository;
    private courseService: CourseService;

    constructor() {
        this.sectionRepository = new SectionRepository();
        this.courseService = new CourseService();
    }

    public async create(courseId: number, instructorId: number, data: ISectionRequestBody) {
        try {
            // * destructure the data
            const { name } = data;

            // * check course exists
            const course = await this.courseService.getOneById(courseId);
            if (!course) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            if (course.instructorId !== instructorId) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }
            // * create section record
            const section = await this.sectionRepository.create({ name, courseId: course.id });

            // * return section
            return section.get({ plain: true });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(sectionId: number, courseId: number, data: Partial<ISectionRequestBody>) {
        try {
            // destructure the data
            const { name } = data;

            // * check section exists
            const section = await this.sectionRepository.getOne({ where: { id: sectionId, courseId: courseId } });
            if (!section) {
                throw new AppError(ResponseMessage.NOT_FOUND('Section'), StatusCodes.NOT_FOUND);
            }

            // * Check the instructor of the course

            // * update the
            return await section.update({ name });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async delete(sectionId: number, courseId: number) {
        try {
            // * check section exists
            const section = await this.sectionRepository.getOne({ where: { id: sectionId, courseId: courseId } });
            if (!section) {
                throw new AppError(ResponseMessage.NOT_FOUND('Section'), StatusCodes.NOT_FOUND);
            }

            // * update the
            return await section.destroy();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getOneWithCourseById(id: number) {
        try {
            return await this.sectionRepository.getOneWithCourseById(id);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default SectionService;
