import { Category } from '../database/models';
import CrudRepository from './crud-repository';

class CategoryRepository extends CrudRepository<Category> {
    constructor() {
        super(Category);
    }
}

export default CategoryRepository;
