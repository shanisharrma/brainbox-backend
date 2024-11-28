import { StatusCodes } from 'http-status-codes';
import { CategoryRepository } from '../repositories';
import { ICategoryRequestBody, ICourseAttributes } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { Category } from '../database/models';
// import { ICourseService } from './interfaces';
import CourseService from './course-service';

interface CourseInstructor {
    firstName: string;
    lastName: string;
}

interface CourseRating {
    rating: number;
    review: string;
}

interface TransformedCourse {
    id: number;
    name: string;
    price: number;
    thumbnail: string;
    instructor: CourseInstructor;
    ratings: CourseRating[];
}

interface TransformedCategory {
    name: string;
    description: string;
    courses: TransformedCourse[];
}

export interface ShowAllCoursesResponse {
    selectedCategory: TransformedCategory | null;
    otherCategory: TransformedCategory[];
    mostSelling: TransformedCourse[];
}

class CategoryService {
    private categoryRepository: CategoryRepository;
    private courseServiceGetter: () => CourseService;

    constructor(getCourseService: () => CourseService) {
        this.categoryRepository = new CategoryRepository();
        this.courseServiceGetter = getCourseService;
    }

    private get CourseService(): CourseService {
        return this.courseServiceGetter();
    }

    public async create(data: ICategoryRequestBody) {
        try {
            // * destruct the data
            const { name, description } = data;

            // * create record in DB
            const category = await this.categoryRepository.create({ name, description });

            // * return response
            return category.get({ plain: true });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAll() {
        try {
            // * get all the categories
            const categories = await this.categoryRepository.getAll();

            return categories;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getByName(name: string) {
        try {
            // * get all the categories
            return await this.categoryRepository.getByName(name);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async showAllCourses(categoryName: string): Promise<ShowAllCoursesResponse> {
        try {
            // * get select category courses by category name
            const selectedCategory = await this.categoryRepository.showAllCoursesByName(categoryName);

            // * get other category courses except given category name
            const otherCategory = await this.categoryRepository.showAllCoursesByNotName(categoryName);

            // * get the most selling courses
            const mostSelling = await this.CourseService.mostSelling();

            const showCategoryCourses: ShowAllCoursesResponse = {
                selectedCategory: null,
                otherCategory: otherCategory.map((category) => this.transformCategoryCourses(category)).flat(),
                mostSelling: this.transformCourses(mostSelling),
            };

            if (selectedCategory) {
                showCategoryCourses.selectedCategory = this.transformCategoryCourses(selectedCategory);
            }
            // * return response
            return showCategoryCourses;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    private transformCourses(courses: ICourseAttributes[]): TransformedCourse[] {
        return courses.map((course) => ({
            id: course.id!,
            name: course.name,
            price: course.price,
            thumbnail: course.thumbnail,
            instructor: {
                firstName: course.instructor!.firstName,
                lastName: course.instructor!.lastName,
            },
            ratings: course.ratings!.map((rating) => ({
                rating: rating.rating,
                review: rating.review,
            })),
        }));
    }

    private transformCategoryCourses(category: Category): TransformedCategory {
        return {
            name: category.name,
            description: category.description,
            courses: this.transformCourses(category.categoryCourses!),
        };
    }
}

export default CategoryService;
