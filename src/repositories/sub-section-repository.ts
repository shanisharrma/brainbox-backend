import { Sub_Section } from '../database/models';
import CrudRepository from './crud-repository';

class SubSectionRepository extends CrudRepository<Sub_Section> {
    constructor() {
        super(Sub_Section);
    }
}

export default SubSectionRepository;
