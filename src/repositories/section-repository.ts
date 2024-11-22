import { Course, Section } from '../database/models';
import CrudRepository from './crud-repository';

class SectionRepository extends CrudRepository<Section> {
    constructor() {
        super(Section);
    }

    public async getOneWithCourseById(id: number) {
        const response = await this.getOne({
            where: { id: id },
            include: [{ model: Course, required: true, as: 'course' }],
        });
        // Return only the dataValues if the response is not null
        return response ? response.get({ plain: true }) : null;
    }
}

export default SectionRepository;
