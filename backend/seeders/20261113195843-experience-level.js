'use strict';

const TABLE_NAME = 'cat_experience_levels';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
      { name: 'Trainee / Becario' },
      { name: 'Junior' },
      { name: 'Semi-Senior' },
      { name: 'Senior' },
      { name: 'Lead / Especialista' },
      { name: 'Gerente / Manager' },
      { name: 'Director' }
     ], {});
   
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
