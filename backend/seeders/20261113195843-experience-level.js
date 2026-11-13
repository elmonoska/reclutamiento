'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('cat_experience_level', [
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
    await queryInterface.bulkDelete('cat_experience_level', null, {});
  }
};
