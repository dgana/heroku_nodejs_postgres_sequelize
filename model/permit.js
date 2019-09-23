const Sequelize = require('sequelize');

/**
 * TABLE PERMIT
 */
const Permit = sequelize.define('permit', {
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
  start_time: {
    type: Sequelize.DATE
  },
  end_time: {
    type: Sequelize.DATE
  },
  working_shift: {
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
  // notes_manager: {
  //   type: sequelize.STRING
  // },
  // notes_hcmga: {
  //   type: Sequelize.STRING
  // },
  // status_manager: {
  //   type: Sequelize.ENUM,
  //   values: ['waiting', 'rejected', 'approved']
  // },
  // status_hcmga: {
  //   type: Sequelize.ENUM,
  //   values: ['waiting', 'rejected', 'approved']
  // },
  // approved_by_manager: {
  //   type: Sequelize.INTEGER
  // },
  // approved_by_hcmga: {
  //   type: Sequelize.INTEGER
  // },
  // rejected_by_manager: {
  //   type: Sequelize.INTEGER
  // },
  // rejected_by_hcmga: {
  //   type: Sequelize.INTEGER
  // }
}, {
  // options
});