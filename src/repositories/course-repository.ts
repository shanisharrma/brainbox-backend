import { Category, Course, Rating, Section, Sub_Section, User } from '../database/models';
import CrudRepository from './crud-repository';

class CourseRepository extends CrudRepository<Course> {
    constructor() {
        super(Course);
    }

    public async getAllWithAllAssociations() {
        const courses = await this.getAll({
            include: [
                { model: Category, required: true, as: 'categories' },
                { model: User, required: true, as: 'instructor' },
                { model: User, as: 'students' },
                {
                    model: Section,
                    required: true,
                    as: 'sections',
                    include: [
                        {
                            model: Sub_Section,
                            required: true,
                            as: 'subSections',
                        },
                    ],
                },
                { model: Rating, as: 'ratings' },
            ],
        });
        return courses;
    }

    public async getOneWithAllAssociationsById(id: number) {
        const courses = await this.getOne({
            where: { id: id },
            include: [
                { model: Category, required: true, as: 'categories' },
                { model: User, required: true, as: 'instructor' },
                { model: User, as: 'students' },
                {
                    model: Section,
                    required: true,
                    as: 'sections',
                    include: [
                        {
                            model: Sub_Section,
                            required: true,
                            as: 'subSections',
                        },
                    ],
                },
                { model: Rating, as: 'ratings' },
            ],
        });
        return courses;
    }
}

export default CourseRepository;
