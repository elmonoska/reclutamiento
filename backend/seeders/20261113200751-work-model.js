'use strict';

const TABLE_NAME = 'cat_work_models';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
      { id_cat_work_model: 1, name: 'Presencial' },
      { id_cat_work_model: 2, name: 'Híbrido' },
      { id_cat_work_model: 3, name: 'Remoto / Home Office' },
      { id_cat_work_model: 4, name: 'Trabajo en campo' }
     ], {});
   

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"cat_work_models"', 'id_cat_work_model'), COALESCE((SELECT MAX("id_cat_work_model") FROM "cat_work_models"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
