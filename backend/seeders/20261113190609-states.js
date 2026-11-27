'use strict';

const TABLE_NAME = 'cat_states';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_NAME, [
      { id_cat_state: 1, name: 'Aguascalientes'},
      { id_cat_state: 2, name: 'Baja California'},
      { id_cat_state: 3, name: 'Baja California Sur'},
      { id_cat_state: 4, name: 'Campeche'},
      { id_cat_state: 5, name: 'Chiapas'},
      { id_cat_state: 6, name: 'Chihuahua'},
      { id_cat_state: 7, name: 'Ciudad de México'},
      { id_cat_state: 8, name: 'Coahuila de Zaragoza'},
      { id_cat_state: 9, name: 'Colima'},
      { id_cat_state: 10, name: 'Durango'},
      { id_cat_state: 11, name: 'Estado de México'},
      { id_cat_state: 12, name: 'Guanajuato'},
      { id_cat_state: 13, name: 'Guerrero'},
      { id_cat_state: 14, name: 'Hidalgo'},
      { id_cat_state: 15, name: 'Jalisco'},
      { id_cat_state: 16, name: 'Michoacán de Ocampo'},
      { id_cat_state: 17, name: 'Morelos'},
      { id_cat_state: 18, name: 'Nayarit'},
      { id_cat_state: 19, name: 'Nuevo León'},
      { id_cat_state: 20, name: 'Oaxaca'},
      { id_cat_state: 21, name: 'Puebla'},
      { id_cat_state: 22, name: 'Querétaro'},
      { id_cat_state: 23, name: 'Quintana Roo'},
      { id_cat_state: 24, name: 'San Luis Potosí'},
      { id_cat_state: 25, name: 'Sinaloa'},
      { id_cat_state: 26, name: 'Sonora'},
      { id_cat_state: 27, name: 'Tabasco'},
      { id_cat_state: 28, name: 'Tamaulipas'},
      { id_cat_state: 29, name: 'Tlaxcala'},
      { id_cat_state: 30, name: 'Veracruz'},
      { id_cat_state: 31, name: 'Yucatán'},
      { id_cat_state: 32, name: 'Zacatecas'},
    ], {}) 

    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(`SELECT setval(pg_get_serial_sequence('"cat_states"', 'id_cat_state'), COALESCE((SELECT MAX("id_cat_state") FROM "cat_states"), 1));`);
    }
  },

  async down (queryInterface, Sequelize) {
    // borra todos los datos al revertir del seeder
    await queryInterface.bulkDelete(TABLE_NAME, null, {});    
  }
};
