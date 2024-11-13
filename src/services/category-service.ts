import { StatusCodes } from 'http-status-codes';
import { CategoryRepository } from '../repositories';
import { ICategoryRequestBody } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';

class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
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

            return categories.map((category) => ({ name: category.name, description: category.description }));
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getByNames(name: string[]) {
        try {
            // * get all the categories
            return await this.categoryRepository.getByNames(name);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async showAllCourses(categoryName: string) {
        try {
            // * get select category courses by category name
            const selectedCategory = await this.categoryRepository.showAllCoursesByName(categoryName);

            // * get other category courses except given category name
            const otherCategory = await this.categoryRepository.showAllCoursesByNotName(categoryName);

            // * return response
            return { selectedCategory, otherCategory };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default CategoryService;
