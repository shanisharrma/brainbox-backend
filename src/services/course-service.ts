import { StatusCodes } from 'http-status-codes';
import { CourseRepository } from '../repositories';
import { ICourseRequestBody } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import CategoryService from './category-service';
import FileUploaderService from './file-uploader-service';

class CourseService {
    private courseRepository: CourseRepository;
    private categoryService: CategoryService;

    constructor() {
        this.courseRepository = new CourseRepository();
        this.categoryService = new CategoryService();
    }

    public async create(data: ICourseRequestBody, file: Express.Multer.File, instructorId: number) {
        try {
            // * destructure the data
            const { name, description, price, whatYouWillLearn, category } = data;

            // * upload the image to cloudinary
            const thumbnailUrl = await FileUploaderService.uploadImageToCloudinary(file.buffer, {
                folder: 'courses',
                public_id: `${name}-${Date.now()}`,
            });

            if (!thumbnailUrl) {
                throw new AppError(ResponseMessage.UPLOAD_FAILED('Image'), StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // * check category exists
            const categoryDetails = await this.categoryService.getByName(category);
            if (!categoryDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Category'), StatusCodes.NOT_FOUND);
            }

            // * create course
            const course = await this.courseRepository.create({
                name,
                description,
                price,
                whatYouWillLearn,
                thumbnail: thumbnailUrl.secure_url,
                instructorId,
            });

            // * add category to the course
            course.addCategory(categoryDetails);

            // * return course
            return course;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async showAll() {
        try {
            const courses = await this.courseRepository.getAllWithAllAssociations();
            if (courses && !courses.length) {
                throw new AppError('Courses not found', StatusCodes.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getOneById(id: number) {
        try {
            const courseDetails = await this.courseRepository.getOneWithAllAssociationsById(id);
            if (!courseDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            return courseDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default CourseService;
