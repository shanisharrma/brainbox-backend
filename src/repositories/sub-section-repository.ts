import { Course, Section, Sub_Section } from '../database/models';
import CrudRepository from './crud-repository';

class SubSectionRepository extends CrudRepository<Sub_Section> {
    constructor() {
        super(Sub_Section);
    }

    public async getWithSectionWithCourseByIdAndSectionId(id: number, sectionId: number) {
        return await this.getOne({
            where: { id: id, sectionId: sectionId },
            include: [
                {
                    model: Section,
                    required: true,
                    as: 'section',
                    include: [{ model: Course, required: true, as: 'course' }],
                },
            ],
        });
    }
}

export default SubSectionRepository;
