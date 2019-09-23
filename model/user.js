/**
 * TABLE USER
 */
const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING
  },
  group: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  gender: {
    type: Sequelize.ENUM,
    values: ['male', 'female']
  },
  superior_id: {
    type: Sequelize.INTEGER
  },
  leave_balance: {
    type: Sequelize.INTEGER
  },
  reimburse_balance: {
    type: Sequelize.INTEGER
  },
  phone_number: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  birth_date: {
    type: Sequelize.DATE
  },
  birth_place: {
    type: Sequelize.STRING
  },
  division: {
    type: Sequelize.STRING
  }
}, {
  // options
});