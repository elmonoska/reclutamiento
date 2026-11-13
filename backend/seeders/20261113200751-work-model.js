'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('cat_work_model', [
      { name: 'Presencial' },
      { name: 'Híbrido' },
      { name: 'Remoto / Home Office' },
      { name: 'Trabajo en campo' }
     ], {});
   
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete('cat_work_model', null, {});
  }
};
