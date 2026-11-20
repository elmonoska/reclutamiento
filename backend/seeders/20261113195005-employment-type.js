'use strict';

const TABLE_NAME = 'cat_employment_types';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
       { name: 'Tiempo Completo'},
       { name: 'Medio Tiempo'},
       { name: 'Freelance / Honorarios'},
       { name: 'Prácticas Profesionales / Becario'},
       { name: 'Temporal / Por Proyecto'},
       { name: 'Por Horas' }
     ], {});
   
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
