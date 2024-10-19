import { Op } from 'sequelize';
import { Category, Course, User } from '../database/models';
import CrudRepository from './crud-repository';

class CategoryRepository extends CrudRepository<Category> {
    constructor() {
        super(Category);
    }

    public async getByNames(name: string[]) {
        return await this.getAll({ where: { name: name } });
    }

    public async showAllCoursesByName(name: string) {
        return await this.getAll({
            where: { name: name },
            include: [
                {
                    model: Course,
                    as: 'courses',
                    include: [{ model: User, required: true, as: 'instructor', attributes: ['firstName', 'lastName'] }],
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
                    as: 'courses',
                    include: [{ model: User, required: true, as: 'instructor', attributes: ['fistName', 'lastName'] }],
                },
            ],
        });
    }
}

export default CategoryRepository;
