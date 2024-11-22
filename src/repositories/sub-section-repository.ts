import { Course, Section, Sub_Section } from '../database/models';
import CrudRepository from './crud-repository';

class SubSectionRepository extends CrudRepository<Sub_Section> {
    constructor() {
        super(Sub_Section);
    }

    public async getWithSectionWithCourseByIdAndSectionId(id: number, sectionId: number) {
        const response = await this.getOne({
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

        // Return only the dataValues if the response is not null
        return response ? (response.get({ plain: true }) as Sub_Section) : null;
    }
}

export default SubSectionRepository;
