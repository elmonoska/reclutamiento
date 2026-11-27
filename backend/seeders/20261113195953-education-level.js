'use strict';

const TABLE_NAME = 'cat_education_levels'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
      { id_cat_education_level: 1, name: 'Secundaria' },
      { id_cat_education_level: 2, name: 'Bachillerato / Preparatoria' },
      { id_cat_education_level: 3, name: 'Técnico / Carrera Técnica' },
      { id_cat_education_level: 4, name: 'Estudiante Universitario' },
      { id_cat_education_level: 5, name: 'Licenciatura / Ingeniería (Trunco o Pasante)' },
      { id_cat_education_level: 6, name: 'Licenciatura / Ingeniería (Titulado)' },
      { id_cat_education_level: 7, name: 'Especialidad' },
      { id_cat_education_level: 8, name: 'Maestría' },
      { id_cat_education_level: 9, name: 'Doctorado' }
     ], {});
   

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"cat_education_levels"', 'id_cat_education_level'), COALESCE((SELECT MAX("id_cat_education_level") FROM "cat_education_levels"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
