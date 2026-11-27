'use strict';

const TABLE_NAME = 'cat_job_categories';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_NAME, [
      { id_cat_job_category: 1, name: 'Tecnologías de la Información'},
      { id_cat_job_category: 2, name: 'Recursos Humanos'},
      { id_cat_job_category: 3, name: 'Ventas y Comercial'},
      { id_cat_job_category: 4, name: 'Mercadotecnia y Publicidad'},
      { id_cat_job_category: 5, name: 'Administración y Finanzas'},
      { id_cat_job_category: 6, name: 'Atención al Cliente'},
      { id_cat_job_category: 7, name: 'Operaciones y Logística'},
      { id_cat_job_category: 8, name: 'Diseño y Arte'},
      { id_cat_job_category: 9, name: 'Legal y Jurídico'},
      { id_cat_job_category: 10, name: 'Producción y Manufactura'},
      { id_cat_job_category: 11, name: 'Salud y Medicina'},
      { id_cat_job_category: 12, name: 'Educación y Docencia' }
    ], {});
   

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"cat_job_categories"', 'id_cat_job_category'), COALESCE((SELECT MAX("id_cat_job_category") FROM "cat_job_categories"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
