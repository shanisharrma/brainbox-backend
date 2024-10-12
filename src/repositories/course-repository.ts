import { Course } from '../database/models';
import CrudRepository from './crud-repository';

class CourseRepository extends CrudRepository<Course> {
    constructor() {
        super(Course);
    }
}

export default CourseRepository;
