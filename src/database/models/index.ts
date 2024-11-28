import Account_Confirmation from './account_confirmation';
import Category from './category';
import Course from './course';
import Course_Progress from './course_progress';
import Log from './log';
import Phone_Number from './phone_number';
import Profile from './profile';
import Rating from './rating';
import Refresh_Token from './refresh_token';
import Reset_Password from './reset_password';
import Role from './role';
import Section from './section';
import Sub_Section from './sub_section';
import Tag from './tag';
import User from './user';

// Many-to-Many Association between Users and Roles through User_Roles
User.belongsToMany(Role, {
    through: 'User_Roles',
    as: 'roles',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Role.belongsToMany(User, {
    through: 'User_Roles',
    as: 'users',
    foreignKey: 'roleId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-One Association with User and Phone_Number
User.hasOne(Phone_Number, {
    foreignKey: 'userId',
    as: 'phoneNumber',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Phone_Number.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-One Association with User and Account_Confirmation
User.hasOne(Account_Confirmation, {
    foreignKey: 'userId',
    as: 'accountConfirmation',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
});
Account_Confirmation.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-One Associations between User and Refresh_Token
User.hasOne(Refresh_Token, {
    foreignKey: 'userId',
    as: 'refreshToken',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Refresh_Token.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-One Associations between User and Reset_Password
User.hasOne(Reset_Password, {
    foreignKey: 'userId',
    as: 'resetPassword',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Reset_Password.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-One Associations between User and Profile
User.hasOne(Profile, {
    foreignKey: 'userId',
    as: 'profileDetails',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Profile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// Many-to-Many Associations between User and Course
User.belongsToMany(Course, {
    through: 'Enrollments',
    foreignKey: 'studentId',
    as: 'enrolledCourses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Course.belongsToMany(User, {
    through: 'Enrollments',
    foreignKey: 'courseId',
    as: 'students',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-Many Associations between Instructor (User) and Course
User.hasMany(Course, {
    foreignKey: 'instructorId',
    as: 'taughtCourses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Course.belongsTo(User, {
    foreignKey: 'instructorId',
    as: 'instructor',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-Many Associations between Category and Course
Category.hasMany(Course, {
    foreignKey: 'categoryId',
    as: 'categoryCourses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Course.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'courseCategory',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Course.belongsToMany(Tag, {
    through: 'Course_Tags',
    foreignKey: 'courseId',
    as: 'courseTags',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Tag.belongsToMany(Course, {
    through: 'Course_Tags',
    foreignKey: 'tagId',
    as: 'tagCourses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-Many Associations between Course and Rating
Course.hasMany(Rating, {
    foreignKey: 'courseId',
    as: 'ratings',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Rating.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-Many Associations between Student(User) and Rating
User.hasMany(Rating, {
    foreignKey: 'studentId',
    as: 'ratings',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Rating.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'students',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// ONe-to-Many Associations between Course and Sections
Course.hasMany(Section, {
    foreignKey: 'courseId',
    as: 'sections',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Section.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-Many Associations between Section and Sub_Section
Section.hasMany(Sub_Section, {
    foreignKey: 'sectionId',
    as: 'subSections',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Sub_Section.belongsTo(Section, {
    foreignKey: 'sectionId',
    as: 'section',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-Many Associations between Course and Course_Progress
Course.hasMany(Course_Progress, {
    foreignKey: 'courseId',
    as: 'progressRecords',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Course_Progress.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// One-to-Many Associations between Student(User) and Course_Progress
User.hasMany(Course_Progress, {
    foreignKey: 'studentId',
    as: 'progressRecords',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Course_Progress.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export {
    Log,
    Role,
    User,
    Phone_Number,
    Account_Confirmation,
    Refresh_Token,
    Reset_Password,
    Profile,
    Course,
    Category,
    Rating,
    Section,
    Sub_Section,
    Course_Progress,
    Tag,
};
