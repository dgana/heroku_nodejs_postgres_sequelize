/**
 * TABEL MANAGER APPROVAL
 */
const ManagerApproval = sequelize.define('manager', {
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
}, {
  associate: (models) => {
    models.ManagerApproval.hasMany(models.Travel)
  }
});