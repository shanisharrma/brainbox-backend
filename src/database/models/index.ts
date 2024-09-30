import Account_Confirmation from './account_confirmation';
import Log from './log';
import Phone_Number from './phone_number';
import Refresh_Token from './refresh_token';
import Reset_Password from './reset_password';
import Role from './role';
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

export {
    Log,
    Role,
    User,
    Phone_Number,
    Account_Confirmation,
    Refresh_Token,
    Reset_Password,
};
