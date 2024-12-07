import { StatusCodes } from 'http-status-codes';
import { CourseRepository, SectionRepository, SubSectionRepository, UserRepository } from '../repositories';
import { ICourseRequestBody, ICourseUpdateParams } from '../types';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import FileUploaderService from './file-uploader-service';
import { Sub_Section } from '../database/models';
import TagService from './tag-service';
// import { ICategoryService } from './interfaces';
import CategoryService from './category-service';

class CourseService {
    private courseRepository: CourseRepository;
    private categoryServiceGetter: () => CategoryService;
    private userRepository: UserRepository;
    private sectionRepository: SectionRepository;
    private subSectionRepository: SubSectionRepository;
    private tagService: TagService;

    constructor(getCategoryService: () => CategoryService) {
        this.courseRepository = new CourseRepository();
        this.categoryServiceGetter = getCategoryService;
        this.userRepository = new UserRepository();
        this.sectionRepository = new SectionRepository();
        this.subSectionRepository = new SubSectionRepository();
        this.tagService = new TagService();
    }

    private get CategoryService(): CategoryService {
        return this.categoryServiceGetter();
    }

    public async create(data: ICourseRequestBody, file: Express.Multer.File, instructorId: number) {
        try {
            // * destructure the data
            const { name, description, price, whatYouWillLearn, category, tags, requirements, status } = data;

            // * upload the image to cloudinary
            const thumbnailUrl = await FileUploaderService.uploadImageToCloudinary(file.buffer, {
                folder: 'courses',
                public_id: `${name}-${Date.now()}`,
            });

            if (!thumbnailUrl) {
                throw new AppError(ResponseMessage.UPLOAD_FAILED('Image'), StatusCodes.INTERNAL_SERVER_ERROR);
            }

            // * check category exists
            const categoryDetail = await this.CategoryService.getByName(category);
            if (!categoryDetail) {
                throw new AppError(ResponseMessage.NOT_FOUND('Category'), StatusCodes.NOT_FOUND);
            }

            const tagIds = await this.tagService.processTags(tags);

            // * create course
            const course = await this.courseRepository.create({
                name,
                description,
                price,
                whatYouWillLearn,
                thumbnail: thumbnailUrl.secure_url,
                requirements,
                instructorId,
                categoryId: categoryDetail.id,
                status,
                sales: 0,
            });

            await course.addCourseTags(tagIds);

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

    public async mostSelling() {
        try {
            const courses = await this.courseRepository.mostSellingWithAssociations();
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

    public async getOneWithAssociationsByIdAndInstructor(id: number, instructorId: number) {
        try {
            const courseDetails = await this.courseRepository.getOneWithAllAssociationsByIdAndInstructor(id);
            if (!courseDetails || courseDetails.instructorId !== instructorId) {
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
            const courses = await this.courseRepository.getAll({ where: { instructorId: instructorId }, raw: true });
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
            // * get the courseIds
            const courseIds = courses.map((course) => course.id);
            // * get complete details of enrolled courses
            const completeCourseDetails = await this.courseRepository.getCompleteCourseDetailsByIds(courseIds);

            return completeCourseDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async viewEnrolledCourse(studentId: number, courseId: number) {
        try {
            // * get user from studentId
            const user = await this.userRepository.getOneById(studentId);

            // * check user exists
            if (!user) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * get the complete course view details
            const viewCourse = await this.courseRepository.getOneWithSectionSubSectionById(courseId);
            if (!viewCourse) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // * check user enrolled
            const isEnrolled = await viewCourse.hasStudent(user);
            if (!isEnrolled) {
                throw new AppError(ResponseMessage.NOT_ENROLLED, StatusCodes.UNAUTHORIZED);
            }

            // * return the view course details
            return viewCourse;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async update(courseId: number, instructorId: number, data: Partial<ICourseUpdateParams>) {
        try {
            // * destructure data
            const { category, description, name, price, whatYouWillLearn, requirements, tags, status, file } = data;

            // * get the course with courseId and instructorId
            const courseDetails = await this.courseRepository.getOneByIdAndInstructor(courseId, instructorId);

            // * check course exists
            if (!courseDetails) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            // * check file exists
            if (file) {
                // * upload the image to cloudinary
                const uploadedThumbnail = await FileUploaderService.uploadImageToCloudinary(file.buffer, {
                    folder: 'courses',
                    public_id: `${name}-${Date.now()}`,
                });

                if (!uploadedThumbnail) {
                    throw new AppError(ResponseMessage.UPLOAD_FAILED('Thumbnail'), StatusCodes.INTERNAL_SERVER_ERROR);
                }

                courseDetails.thumbnail = uploadedThumbnail.secure_url;
            }

            if (category) {
                // * check categories exits
                const newCategory = await this.CategoryService.getByName(category!);
                if (!newCategory) {
                    throw new AppError(ResponseMessage.NOT_FOUND('Category'), StatusCodes.NOT_FOUND);
                }

                courseDetails.categoryId = newCategory.id;
            }

            if (tags && tags.length > 0) {
                // * get the tagIds after processing
                const tagIds = await this.tagService.processTags(tags);

                // * get old tags
                const oldTagIds = await courseDetails.getCourseTags();

                // * remove old tags
                await courseDetails.removeCourseTags(oldTagIds);

                // * add new tags to course
                await courseDetails.addCourseTags(tagIds);
            }

            // * update the course
            courseDetails.requirements = requirements ? requirements : courseDetails.requirements;
            courseDetails.name = name ? name : courseDetails.name;
            courseDetails.description = description ? description : courseDetails.description;
            courseDetails.price = price ? price : courseDetails.price;
            courseDetails.whatYouWillLearn = whatYouWillLearn ? whatYouWillLearn : courseDetails.whatYouWillLearn;
            courseDetails.status = status ? status : courseDetails.status;

            await courseDetails.save();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async destroy(courseId: number, instructorId: number) {
        try {
            // * check course exists with courseId and instructorId
            const completeCourseDetails = await this.courseRepository.getOneWithAllAssociationsById(courseId);
            if (
                !completeCourseDetails ||
                (completeCourseDetails && completeCourseDetails.instructorId !== instructorId)
            ) {
                throw new AppError(ResponseMessage.NOT_FOUND('Course'), StatusCodes.NOT_FOUND);
            }

            const course = await this.courseRepository.getOneByIdAndInstructor(courseId, instructorId);
            if (!course) {
                throw new AppError(ResponseMessage.NOT_AUTHORIZATION, StatusCodes.UNAUTHORIZED);
            }

            // // * check tags exists or not, if exists --> get the tags id and delete the course category
            if (completeCourseDetails.courseTags && completeCourseDetails.courseTags.length >= 0) {
                // * Step-1: remove the associated tags from Course_Tags table

                // ** get old associated courseTags
                const oldCourseTags = await course.getCourseTags();
                // ** remove the tags from table
                await course.removeCourseTags(oldCourseTags);

                // * Step-2: Check and clean up th unused tags from tags table;

                // ** get the tagIds of all the tags
                const tagIds = completeCourseDetails.courseTags.map((tag) => tag.id!);
                // ** get the unused tags using the tagIds
                const unusedTags = await this.tagService.getAllByIds(tagIds);
                // ** check if length is greater than 0
                if (unusedTags.length > 0) {
                    const tagsToDelete = unusedTags.filter((tag) => tag.tagCourses!.length === 0);
                    if (tagsToDelete.length > 0) {
                        const unusedTagIds = tagsToDelete.map((tag) => tag.id);
                        await this.tagService.destroyAllByIds(unusedTagIds);
                    }
                }
            }

            // * check students enrolled or not, if yes --> get the enrolled students id and delete them from enrollments
            if (completeCourseDetails.students && completeCourseDetails.students.length >= 0) {
                // * get old associated enrolled students
                const enrolledStudents = await course.getStudents();
                // * delete them from the enrollments
                await course.removeStudents(enrolledStudents);
            }

            // * check sections exits or not in the course
            if (completeCourseDetails.sections && completeCourseDetails.sections.length >= 0) {
                // * get the details of sections id from completeCourseDetails
                const sectionIds = completeCourseDetails.sections.map((section) => section.id);
                // * get the details of sections with subSections
                const sections = await this.sectionRepository.getAll({
                    where: { id: sectionIds },
                    include: [{ model: Sub_Section, required: true, as: 'subSections' }],
                });

                // * get the all subSections from section
                const allSubSections = sections.map((section) => section.subSections);
                // * flat the subSections by 1 dimension
                const subSections = allSubSections.flat();
                // * fetch all the subSection ids
                const subSectionIds = subSections.map((subSection) => subSection!.id);
                // * fetch all the subSection videoUrls
                const subSectionVideos = subSections.map((subSection) => subSection!.videoUrl);

                // * delete the subSections first
                await this.subSectionRepository.destroyAll({ where: { id: subSectionIds } });
                // * delete the sections
                await this.sectionRepository.destroyAll({ where: { id: sectionIds } });

                // * check if subSectionVideos length
                if (subSectionVideos.length > 0) {
                    await FileUploaderService.deleteRelatedFiles(subSectionVideos);
                }
            }

            if (completeCourseDetails.thumbnail) {
                await FileUploaderService.deleteFile(completeCourseDetails.thumbnail);
            }

            // * delete the course now and
            return await course.destroy();
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default CourseService;
