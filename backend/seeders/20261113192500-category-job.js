'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cat_category_job', [
      { name: 'Tecnologías de la Información'},
      { name: 'Recursos Humanos'},
      { name: 'Ventas y Comercial'},
      { name: 'Mercadotecnia y Publicidad'},
      { name: 'Administración y Finanzas'},
      { name: 'Atención al Cliente'},
      { name: 'Operaciones y Logística'},
      { name: 'Diseño y Arte'},
      { name: 'Legal y Jurídico'},
      { name: 'Producción y Manufactura'},
      { name: 'Salud y Medicina'},
      { name: 'Educación y Docencia' }
    ], {});
   
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete('cat_category_job', null, {});
  }
};
