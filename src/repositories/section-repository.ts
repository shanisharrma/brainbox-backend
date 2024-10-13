import { Course, Section } from '../database/models';
import CrudRepository from './crud-repository';

class SectionRepository extends CrudRepository<Section> {
    constructor() {
        super(Section);
    }

    public async getOneWithCourseById(id: number) {
        return await this.getOne({ where: { id: id }, include: [{ model: Course, required: true, as: 'course' }] });
    }
}

export default SectionRepository;
