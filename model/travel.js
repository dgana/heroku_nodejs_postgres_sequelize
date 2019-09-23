/**
 * TABLE TRAVEL
 */
const Travel = sequelize.define('travel', {
  name: {
    type: Sequelize.STRING
  },
  created_by: {
    type: Sequelize.INTEGER
  },
  start_date: {
    type: Sequelize.DATE
  },
  end_date: {
    type: Sequelize.DATE
  },
  destination: {
    type: Sequelize.STRING
  },
  agenda: {
    type: Sequelize.STRING
  },
  advance_amount: {
    type: Sequelize.INTEGER
  },
  notes: {
    type: Sequelize.STRING
  },
  manager_id: {
    type: Sequelize.STRING
  },
  hcmga_id: {
    type: Sequelize.STRING
  }
}, {
  // options
}, {
  associate: (models) => {
    models.Travel.belongsTo(models.ManagerApproval)
  }
});