import { Section } from '../database/models';
import CrudRepository from './crud-repository';

class SectionRepository extends CrudRepository<Section> {
    constructor() {
        super(Section);
    }
}

export default SectionRepository;
