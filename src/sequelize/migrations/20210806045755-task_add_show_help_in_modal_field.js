'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn(
            'lessons_task',
            'show_help_in_modal',
            {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
            }
        )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn(
            'lessons_task',
            'show_help_in_modal'
        );
  }
};
