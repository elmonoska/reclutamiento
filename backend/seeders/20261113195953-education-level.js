'use strict';

const TABLE_NAME = 'cat_education_levels'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(TABLE_NAME, [
      { name: 'Secundaria' },
      { name: 'Bachillerato / Preparatoria' },
      { name: 'Técnico / Carrera Técnica' },
      { name: 'Estudiante Universitario' },
      { name: 'Licenciatura / Ingeniería (Trunco o Pasante)' },
      { name: 'Licenciatura / Ingeniería (Titulado)' },
      { name: 'Especialidad' },
      { name: 'Maestría' },
      { name: 'Doctorado' }
     ], {});
   
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
