'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('cat_education_level', [
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
    await queryInterface.bulkDelete('cat_education_level', null, {});
  }
};
