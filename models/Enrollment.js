const { sequelize, DataTypes } = require('../orm');

const Enrollment = sequelize.define('Enrollment', {
  Student_ID: {
    type: DataTypes.STRING(9),
    primaryKey: true
  },
  Course_ID: {
    type: DataTypes.STRING(8),
    primaryKey: true
  },
  Semester_ID: {
    type: DataTypes.STRING(6),
    primaryKey: true
  },
  Grade: DataTypes.INTEGER,
  Status: {
    type: DataTypes.STRING(20),
    defaultValue: '正常'
  },
  Enrollment_Date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
  
}, {
  tableName: 'ENROLLMENT',
  timestamps: false
});

module.exports = Enrollment;
