'use strict';

const TABLE_NAME = 'cat_work_models';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
      { name: 'Presencial' },
      { name: 'Híbrido' },
      { name: 'Remoto / Home Office' },
      { name: 'Trabajo en campo' }
     ], {});
   
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
