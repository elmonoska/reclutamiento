'use strict';

const TABLE_NAME = 'cat_application_statuses';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_NAME, [
      { id_cat_application_status: 1, name: 'applied' },
      { id_cat_application_status: 2, name: 'in_review' },
      { id_cat_application_status: 3, name: 'interview' },
      { id_cat_application_status: 4, name: 'rejected' },
      { id_cat_application_status: 5, name: 'hired' },
    ], {});

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"cat_application_statuses"', 'id_cat_application_status'), COALESCE((SELECT MAX("id_cat_application_status") FROM "cat_application_statuses"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
