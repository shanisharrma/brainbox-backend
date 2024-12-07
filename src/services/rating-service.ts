import { StatusCodes } from 'http-status-codes';
import { CourseRepository, RatingRepository, UserRepository } from '../repositories';
import { IRatingRequestBody } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';

class RatingService {
    private ratingRepository: RatingRepository;
    private courseRepository: CourseRepository;
    private userRepository: UserRepository;

    constructor() {
        this.ratingRepository = new RatingRepository();
        this.courseRepository = new CourseRepository();
        this.userRepository = new UserRepository();
    }

    public async create(studentId: number, courseId: number, data: IRatingRequestBody) {
        try {
            // * destructure data
            const { rating, review } = data;

            // * check course exists
            const course = await this.courseRepository.getOneById(courseId);
            if (!course) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }
            // * check user exits
            const user = await this.userRepository.getOneById(studentId);
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }
            // * check user enrolled in course
            const userEnrolled = course.hasStudent(user);
            if (!userEnrolled) {
                throw new AppError('User not enrolled to the course.', StatusCodes.UNAUTHORIZED);
            }

            // * check user already not reviewed the course
            const alreadyReviewed = await this.ratingRepository.getAll({
                where: { courseId: courseId, studentId: studentId },
            });
            if (!alreadyReviewed) {
                throw new AppError('You have already reviewed this course.', StatusCodes.FORBIDDEN);
            }

            // * create rating & review
            const ratingReview = await this.ratingRepository.create({ courseId, studentId, rating, review });

            // * return response
            return ratingReview.get({ plain: true });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAverage(courseId: number) {
        try {
            // * calculate average rating
            const averageRating = await this.ratingRepository.getAverageByCourseId(courseId);

            // * return average
            return averageRating && averageRating !== null ? averageRating : 0;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async showAll() {
        try {
            const ratingAndReviews = await this.ratingRepository.showAll();

            return ratingAndReviews;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default RatingService;
