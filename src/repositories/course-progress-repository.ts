import { Course_Progress } from '../database/models';
import CrudRepository from './crud-repository';

class CourseProgressRepository extends CrudRepository<Course_Progress> {
    constructor() {
        super(Course_Progress);
    }
}

export default CourseProgressRepository;
