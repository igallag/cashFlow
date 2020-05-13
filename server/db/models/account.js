const Sequelize = require('sequelize')
const db = require('../db')

const Account = db.define('account', {
  accountID: {
    type: Sequelize.STRING,
    allowNull: false
  },
  itemID: {
    type: Sequelize.STRING,
    allowNull: false
  },
  institutionID: {
    type: Sequelize.STRING,
    allowNull: false
  },
  insittutionName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  accountName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  accountType: {
    type: Sequelize.STRING
  }
})

export default Account
