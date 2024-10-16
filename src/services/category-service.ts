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
            return category;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAll() {
        try {
            // * get all the categories
            return await this.categoryRepository.getAll();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getByName(name: string[]) {
        try {
            // * get all the categories
            return await this.categoryRepository.getByName(name);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default CategoryService;
