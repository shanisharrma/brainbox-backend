import { Category } from '../database/models';
import CrudRepository from './crud-repository';

class CategoryRepository extends CrudRepository<Category> {
    constructor() {
        super(Category);
    }

    public async getByName(name: string) {
        return await this.getOne({ where: { name: name } });
    }
}

export default CategoryRepository;
