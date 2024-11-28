import { Op } from 'sequelize';
import { Category, Course, Rating, User } from '../database/models';
import CrudRepository from './crud-repository';

class CategoryRepository extends CrudRepository<Category> {
    constructor() {
        super(Category);
    }

    public async getByName(name: string) {
        return await this.getOne({ where: { name: name } });
    }

    public async showAllCoursesByName(name: string) {
        return await this.getOne({
            where: { name: name },
            include: [
                {
                    model: Course,
                    as: 'categoryCourses',
                    where: { status: 'published' },
                    include: [
                        {
                            model: User,
                            as: 'instructor',
                            attributes: ['firstName', 'lastName'],
                        },
                        {
                            model: Rating,
                            as: 'ratings',
                        },
                    ],
                },
            ],
        });
    }

    public async showAllCoursesByNotName(name: string) {
        return await this.getAll({
            where: { name: { [Op.ne]: name } },
            include: [
                {
                    model: Course,
                    as: 'categoryCourses',
                    where: { status: 'published' },
                    include: [
                        {
                            model: User,
                            as: 'instructor',
                            attributes: ['firstName', 'lastName'],
                        },
                        {
                            model: Rating,
                            as: 'ratings',
                        },
                    ],
                },
            ],
        });
    }
}

export default CategoryRepository;
