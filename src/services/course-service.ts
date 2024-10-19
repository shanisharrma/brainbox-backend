import { StatusCodes } from 'http-status-codes';
import { CourseRepository, SectionRepository, SubSectionRepository, UserRepository } from '../repositories';
import { ICourseRequestBody } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import CategoryService from './category-service';
import FileUploaderService from './file-uploader-service';
import { Sub_Section } from '../database/models';

class CourseService {
    private courseRepository: CourseRepository;
    private categoryService: CategoryService;
    private userRepository: UserRepository;
    private sectionRepository: SectionRepository;
    private subSectionRepository: SubSectionRepository;

    constructor() {
        this.courseRepository = new CourseRepository();
        this.categoryService = new CategoryService();
        this.userRepository = new UserRepository();
        this.sectionRepository = new SectionRepository();
        this.subSectionRepository = new SubSectionRepository();
    }

    public async create(data: ICourseRequestBody, file: Express.Multer.File, instructorId: number) {
        try {
            // * destructure the data
            const { name, description, price, whatYouWillLearn, categories } = data;

            // * upload the image to cloudinary
            const thumbnailUrl = await FileUploaderService.uploadImageToCloudinary(file.buffer, {
                folder: 'courses',
                public_id: `${name}-${Date.now()}`,
            });

            if (!thumbnailUrl) {
                throw new AppError(ResponseMessage.UPLOAD_FAILED('Image'), StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // * check category exists
            const categoriesDetail = await this.categoryService.getByNames(categories);
            if (!categoriesDetail) {
                throw new AppError(ResponseMessage.NOT_FOUND('Category'), StatusCodes.NOT_FOUND);
            }

            // * create course
            const course = await this.courseRepository.create({
                name,
                description,
                price,
                whatYouWillLearn,
                thumbnail: thumbnailUrl.secure_url,
                instructorId,
            });

            // * add category to the course
            course.addCategories(categoriesDetail);

            // * return course
            return course;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async showAll() {
        try {
            const courses = await this.courseRepository.getAllWithAllAssociations();
            if (courses && !courses.length) {
                throw new AppError('Courses not found', StatusCodes.NOT_FOUND);
            }
            return courses;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getOneWithAssociationsById(id: number) {
        try {
            const courseDetails = await this.courseRepository.getOneWithAllAssociationsById(id);
            if (!courseDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            return courseDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getOneById(id: number) {
        try {
            const courseDetails = await this.courseRepository.getOneById(id);
            if (!courseDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            return courseDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async taughtCourses(instructorId: number) {
        try {
            // * get course of current instructor
            const courses = await this.courseRepository.getAll({ where: { instructorId: instructorId } });
            if (!courses) {
                throw new AppError(ResponseMessage.NOT_FOUND('Courses'), StatusCodes.NOT_FOUND);
            }
            return courses;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async enrolledCourses(studentId: number) {
        try {
            // * get user from studentId
            const user = await this.userRepository.getOneById(studentId);

            // * check user exists
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * get enrolled courses
            const courses = await user.getEnrolledCourses();

            return courses;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(
        courseId: number,
        instructorId: number,
        file: Express.Multer.File,
        data: Partial<ICourseRequestBody>,
    ) {
        try {
            // * destructure data
            const { categories, description, name, price, whatYouWillLearn } = data;

            // * get the course with courseId and instructorId
            const courseDetails = await this.courseRepository.getOneByIdAndInstructor(courseId, instructorId);

            // * check course exists
            if (!courseDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            // * check file exists
            if (file) {
                // * validate the file
                const validatedFile = FileUploaderService.validateFile(file, {
                    fieldName: file.filename,
                    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                    maxSize: 1024 * 1024 * 5,
                });

                // * upload the image to cloudinary
                const uploadedThumbnail = await FileUploaderService.uploadImageToCloudinary(validatedFile.buffer, {
                    folder: 'courses',
                    public_id: `${name}-${Date.now()}`,
                });

                if (!uploadedThumbnail) {
                    throw new AppError(ResponseMessage.UPLOAD_FAILED('Thumbnail'), StatusCodes.INTERNAL_SERVER_ERROR);
                }

                courseDetails.thumbnail = uploadedThumbnail.secure_url;
            }

            // * check categories exits
            const newCategories = await this.categoryService.getByNames(categories!);
            if (newCategories && newCategories.length <= 0) {
                throw new AppError(ResponseMessage.NOT_FOUND('Categories'), StatusCodes.NOT_FOUND);
            }

            // get old categories
            const oldCategories = await courseDetails.getCategories();

            // * remove old categories
            await courseDetails.removeCategories(oldCategories);

            // * add new categories to course
            await courseDetails.addCategories(newCategories);

            // * update the course
            courseDetails.name = name ? name : courseDetails.name;
            courseDetails.description = description ? description : courseDetails.description;
            courseDetails.price = price ? price : courseDetails.price;
            courseDetails.whatYouWillLearn = whatYouWillLearn ? whatYouWillLearn : courseDetails.whatYouWillLearn;

            await courseDetails.save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async destroy(courseId: number, instructorId: number) {
        try {
            // * check course exists with courseId and instructorId
            const course = await this.courseRepository.getOneWithAllAssociationsById(courseId);
            if (!course || (course && course.instructorId !== instructorId)) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            // * check categories exists or not, if exists --> get the categories id and delete the course category
            if (course.categories && course.categories.length >= 0) {
                // * get the names of category from course
                const courseCategories = course.categories.map((category) => category.name);
                // * get the categories details by names;
                const categories = await this.categoryService.getByNames(courseCategories);
                // * delete the categories from table
                await course.removeCategories(categories);
            }

            // * check students enrolled or not, if yes --> get the enrolled students id and delete them from enrollments
            if (course.students && course.students.length >= 0) {
                // * get the id of enrolled students
                const enrolledStudents = course.students.map((student) => student.id);
                // * get the details of enrolled students
                const students = await this.userRepository.getAll({ where: { id: enrolledStudents } });
                // * delete them from the enrollments
                await course.removeStudents(students);
            }

            // * check sections exits or not in the course
            if (course.sections && course.sections.length >= 0) {
                // * get the details of sections id from course
                const sectionIds = course.sections.map((section) => section.id);
                // * get the details of sections with subSections
                const sections = await this.sectionRepository.getAll({
                    where: { id: sectionIds },
                    include: [{ model: Sub_Section, required: true, as: 'subSections' }],
                });

                // * get the subSections id from section
                const subSectionIds = sections.map((section) =>
                    section.subSections?.map((subSection) => subSection.id),
                );

                // * reduce the multilevel array of subSection Ids into a 1-D array using reduce function
                const subSectionId = subSectionIds.reduce((acc, val) => acc?.concat(val), []);

                // * delete the subSections first
                await this.subSectionRepository.destroyAll({ where: { id: subSectionId } });
                // * delete the sections
                await this.sectionRepository.destroyAll({ where: { id: sectionIds } });
            }
            // * delete the course now and
            await course.destroy();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default CourseService;
