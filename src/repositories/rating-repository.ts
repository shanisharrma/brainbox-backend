import { Course, Profile, Rating, User } from '../database/models';
import CrudRepository from './crud-repository';

class RatingRepository extends CrudRepository<Rating> {
    constructor() {
        super(Rating);
    }

    public async getAverageByCourseId(courseId: number): Promise<number | null | undefined> {
        const ratings = await this.getOne({
            where: { courseId: courseId },
            attributes: [[Rating.sequelize!.fn('AVG', Rating.sequelize!.col('rating')), 'averageRating']],
            raw: true,
        });

        return ratings && ratings.averageRating !== null ? ratings.averageRating : null;
    }

    public async showAll() {
        const ratings = await this.getAll({
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['firstName', 'lastName', 'email'],
                    include: [{ model: Profile, as: 'profileDetails', attributes: ['imageUrl'] }],
                },
                { model: Course, as: 'course', attributes: ['name'] },
            ],
        });

        return ratings;
    }
}

export default RatingRepository;
