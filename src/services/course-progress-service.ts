import { StatusCodes } from 'http-status-codes';
import { CourseProgressRepository, CourseRepository, UserRepository } from '../repositories';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';

class CourseProgressService {
    private courseProgressRepository: CourseProgressRepository;
    private courseRepository: CourseRepository;
    private userRepository: UserRepository;

    constructor() {
        this.courseProgressRepository = new CourseProgressRepository();
        this.courseRepository = new CourseRepository();
        this.userRepository = new UserRepository();
    }

    public async create(courseId: number, studentId: number, subSectionId: number | null) {
        try {
            // * check the course exits
            const courseDetails = await this.courseRepository.getOneWithAllAssociationsById(courseId);
            if (!courseDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            // * get and check the student exists
            const user = await this.userRepository.getOneById(studentId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * check student is enrolled to the course
            const isEnrolled = await courseDetails.hasStudent(user);
            if (!isEnrolled) {
                throw new AppError(ResponseMessage.NOT_ENROLLED, StatusCodes.UNAUTHORIZED);
            }

            // * check subSection is part of course
            if (!courseDetails.sections || (courseDetails.sections && courseDetails.sections.length <= 0)) {
                throw new AppError(ResponseMessage.NOT_FOUND('Sections'), StatusCodes.NOT_FOUND);
            }

            let completedSubSections: number[] = [];
            // * check if subSectionId is not null
            if (subSectionId !== null) {
                completedSubSections = [subSectionId];
            }

            const totalSubSections = courseDetails.sections.reduce(
                (total, section) => total + section.subSections!.length,
                0,
            );

            // * create course progress
            await this.courseProgressRepository.create({
                courseId,
                studentId,
                totalSubSections,
                completedSubSections,
                progressPercentage: 0,
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateProgress(studentId: number, courseId: number, subSectionId: number) {
        try {
            // * get and check the student exists
            const user = await this.userRepository.getOneById(studentId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * get the course_progress of the student
            const courseProgress = await this.courseProgressRepository.getOne({ where: { studentId, courseId } });

            if (!courseProgress) {
                await this.create(courseId, studentId, subSectionId);
            } else {
                // * add the sub section completed list if not already added
                const updatedSubSections = [...courseProgress.completedSubSections, subSectionId];

                // * Recalculate progress percentage
                const progressPercentage = (updatedSubSections.length / courseProgress.totalSubSections) * 100;

                // * update the course progress
                await courseProgress.update({
                    completedSubSections: updatedSubSections,
                    progressPercentage,
                });
            }
            return courseProgress;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getProgress(studentId: number, courseId: number) {
        try {
            const courseProgress = await this.courseProgressRepository.getOne({ where: { studentId, courseId } });
            if (!courseProgress) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course Progress'), StatusCodes.NOT_FOUND);
            }
            return courseProgress;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default CourseProgressService;
