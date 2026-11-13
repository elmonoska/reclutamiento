'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('cat_employment_type', [
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
    await queryInterface.bulkDelete('cat_employment_type', null, {});
  }
};
