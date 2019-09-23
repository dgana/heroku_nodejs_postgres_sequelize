/**
 * TABLE LEAVE
 */
const Leave = sequelize.define('leave', {
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
});