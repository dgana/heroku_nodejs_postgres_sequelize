/**
 * TABLE HCMGA APPROVAL
 */
const HCMGAApproval = sequelize.define('manager', {
  notes: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.ENUM,
    values: ['waiting', 'rejected', 'approved']
  },
  approved_by: {
    type: Sequelize.INTEGER
  },
  rejected_by: {
    type: Sequelize.INTEGER
  }
}, {
  // options
});