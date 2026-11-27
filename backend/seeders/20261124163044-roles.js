'use strict';

const TABLE_NAME = 'roles';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_NAME, [
      { id_role: 1, name: 'admin' },
      { id_role: 2, name: 'recruiter' },
      { id_role: 3, name: 'candidate' },
    ], {});

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"roles"', 'id_role'), COALESCE((SELECT MAX("id_role") FROM "roles"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
