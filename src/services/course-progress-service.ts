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

    public async create(courseId: number, studentId: number, subSectionId: number) {
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

            // * get all the subSections from the course
            const subSectionsArray = courseDetails.sections.map((section) => section.subSections);
            // * flatten the subSections multi-level array to 1 level
            const subSections = subSectionsArray.flat();
            // * filter out the subSection which matches the subSectionId
            const isSubSection = subSections.filter((subSection) => subSection!.id === subSectionId);
            // * check subSection found or not
            if (!isSubSection || isSubSection.length <= 0) {
                throw new AppError(ResponseMessage.NOT_FOUND('Sub Section'), StatusCodes.NOT_FOUND);
            }

            // * create course progress
            const courseProgress = await this.courseProgressRepository.create({ courseId, studentId, subSectionId });

            // * return response
            return courseProgress;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getCourseProgressPercentage(studentId: number, courseId: number) {
        try {
            // * get the course details
            const courseDetails = await this.courseRepository.getOneWithAllAssociationsById(courseId);
            if (!courseDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            // * get the student details and check students exists
            const student = await this.userRepository.getOneById(studentId);
            if (!student) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * check student enrolled in the course
            const isEnrolled = await courseDetails.hasStudent(student);
            if (!isEnrolled) {
                throw new AppError(ResponseMessage.NOT_ENROLLED, StatusCodes.UNAUTHORIZED);
            }

            // * check sections exists in course
            if (!courseDetails.sections || (courseDetails.sections && courseDetails.sections.length <= 0)) {
                throw new AppError(ResponseMessage.NOT_FOUND('Sections'), StatusCodes.NOT_FOUND);
            }

            // * get the number of sub_sections in the course
            const totalLectures = courseDetails.sections.reduce((total, section) => {
                return total + (section.subSections ? section.subSections.length : 0);
            }, 0);

            // * get the number of sub_sections completed by the student
            const courseProgressDetails = await this.courseProgressRepository.getAll({
                where: { courseId, studentId },
            });
            if (!courseProgressDetails) {
                return 0;
            }

            // count the number of completed lectures
            const completedLectures = courseProgressDetails.length;

            // * calculate the course_progress percentage
            const courseProgressPercentage = (completedLectures / totalLectures) * 100;

            // * return course_progress percentage
            return courseProgressPercentage;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default CourseProgressService;
