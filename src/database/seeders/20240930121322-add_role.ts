'use strict';

import { QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        await queryInterface.bulkInsert('Roles', [
            {
                role: 'admin',
                description: 'Administration level access',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role: 'student',
                description: 'Student level access',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                role: 'instructor',
                description: 'Instructor level access',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface: QueryInterface) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Roles', {});
    },
};
