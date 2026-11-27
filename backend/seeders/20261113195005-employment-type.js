'use strict';

const TABLE_NAME = 'cat_employment_types';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
       { id_cat_employment_type: 1, name: 'Tiempo Completo'},
       { id_cat_employment_type: 2, name: 'Medio Tiempo'},
       { id_cat_employment_type: 3, name: 'Freelance / Honorarios'},
       { id_cat_employment_type: 4, name: 'Prácticas Profesionales / Becario'},
       { id_cat_employment_type: 5, name: 'Temporal / Por Proyecto'},
       { id_cat_employment_type: 6, name: 'Por Horas' }
     ], {});
   

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"cat_employment_types"', 'id_cat_employment_type'), COALESCE((SELECT MAX("id_cat_employment_type") FROM "cat_employment_types"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
