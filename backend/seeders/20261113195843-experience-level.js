'use strict';

const TABLE_NAME = 'cat_experience_levels';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
      { id_cat_experience_level: 1, name: 'Trainee / Becario' },
      { id_cat_experience_level: 2, name: 'Junior' },
      { id_cat_experience_level: 3, name: 'Semi-Senior' },
      { id_cat_experience_level: 4, name: 'Senior' },
      { id_cat_experience_level: 5, name: 'Lead / Especialista' },
      { id_cat_experience_level: 6, name: 'Gerente / Manager' },
      { id_cat_experience_level: 7, name: 'Director' }
     ], {});
   

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"cat_experience_levels"', 'id_cat_experience_level'), COALESCE((SELECT MAX("id_cat_experience_level") FROM "cat_experience_levels"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
