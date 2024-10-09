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

        await queryInterface.bulkInsert(
            'Categories',
            [
                {
                    name: 'Web Development',
                    description:
                        'Courses related to web development, including front-end, back-end, and full-stack development.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Data Science',
                    description: 'Courses focusing on data analysis, machine learning, and statistical techniques.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Mobile Development',
                    description:
                        'Courses covering mobile app development for iOS, Android, and cross-platform frameworks.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Cybersecurity',
                    description: 'Courses on security measures, ethical hacking, and protecting digital assets.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Artificial Intelligence',
                    description: 'Courses about AI concepts, neural networks, and automation techniques.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Cloud Computing',
                    description: 'Courses on cloud infrastructure, services like AWS, Azure, and Google Cloud.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    async down(queryInterface: QueryInterface) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Categories', {});
    },
};
