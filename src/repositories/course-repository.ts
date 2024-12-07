import {
    Category,
    Course,
    Course_Progress,
    Profile,
    Rating,
    Section,
    Sub_Section,
    Tag,
    User,
} from '../database/models';
import CrudRepository from './crud-repository';

class CourseRepository extends CrudRepository<Course> {
    constructor() {
        super(Course);
    }

    public async getAllWithAllAssociations() {
        const courses = await this.getAll({
            include: [
                { model: Category, required: true, as: 'courseCategory' },
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
                { model: Tag, required: true, as: 'courseTags' },
                { model: Rating, as: 'ratings' },
            ],
        });
        return courses;
    }

    public async mostSellingWithAssociations() {
        const courses = await this.getAll({
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
            order: [['sales', 'DESC']],
            limit: 6,
        });
        return courses;
    }

    public async getOneWithAllAssociationsById(id: number) {
        const course = await this.getOne({
            where: { id: id },
            include: [
                { model: Category, required: true, as: 'courseCategory', attributes: ['id', 'name', 'description'] },
                {
                    model: User,
                    required: true,
                    as: 'instructor',
                    attributes: ['id', 'firstName', 'lastName'],
                    include: [
                        {
                            model: Profile,
                            as: 'profileDetails',
                            attributes: ['id', 'imageUrl', 'about'],
                        },
                    ],
                },
                { model: User, as: 'students', attributes: ['id', 'firstName', 'lastName'] },
                {
                    model: Section,
                    required: true,
                    as: 'sections',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Sub_Section,
                            required: true,
                            as: 'subSections',
                            attributes: ['id', 'title', 'description', 'duration'],
                        },
                    ],
                },
                { model: Tag, required: true, as: 'courseTags', attributes: ['id', 'name'] },
                { model: Rating, as: 'ratings' },
            ],
        });
        // Return only the dataValues if the response is not null
        return course;
    }

    public async getOneWithAllAssociationsByIdAndInstructor(id: number) {
        const courses = await this.getOne({
            where: { id: id },
            include: [
                { model: Category, required: true, as: 'courseCategory' },
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
                { model: Tag, required: true, as: 'courseTags' },
            ],
        });
        // Return only the dataValues if the response is not null
        return courses ? (courses.get({ plain: true }) as Course) : null;
    }

    public async getCompleteCourseDetailsByIds(courseIds: number[]) {
        const courses = await this.getAll({
            where: { id: courseIds },
            include: [
                {
                    model: Section,
                    as: 'sections',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Sub_Section,
                            as: 'subSections',
                            attributes: ['id', 'title', 'duration'],
                        },
                    ],
                },
                {
                    model: Course_Progress,
                    as: 'progressRecord',
                },
            ],
        });
        return courses;
    }

    public async getOneWithSectionSubSectionById(id: number) {
        const course = await this.getOne({
            where: { id: id },
            include: [
                {
                    model: Section,
                    as: 'sections',
                    include: [{ model: Sub_Section, as: 'subSections' }],
                },
                {
                    model: Course_Progress,
                    as: 'progressRecord',
                },
            ],
        });

        return course;
    }

    public async getOneByIdAndInstructor(id: number, instructorId: number) {
        const courses = await this.getOne({ where: { id: id, instructorId: instructorId } });
        // Return only the dataValues if the response is not null
        return courses;
    }
}

export default CourseRepository;
