// ormTransferStudent.js
const { sequelize, Student, Course, Enrollment } = require('./models/index');

async function transferStudent(studentId, oldDeptId, newDeptId) {
  const t = await sequelize.transaction();
  try {
    // 1. 更新學生所屬系所
    await Student.update(
      { Department_ID: newDeptId },
      { where: { Student_ID: studentId }, transaction: t }
    );

    // 2. 標記舊系所課程為「轉系退選」
    const oldCourses = await Course.findAll({
      where: { Department_ID: oldDeptId },
      attributes: ['Course_ID'],
      transaction: t
    });

    const oldCourseIds = oldCourses.map(course => course.Course_ID);

    await Enrollment.update(
      { Status: '轉系退選' },
      {
        where: {
          Student_ID: studentId,
          Course_ID: oldCourseIds
        },
        transaction: t
      }
    );

    // 3. 加選新系所課程
    const newCourses = await Course.findAll({
      where: { Department_ID: newDeptId },
      attributes: ['Course_ID'],
      transaction: t
    });

    const currentSemester = '112-1';
    const now = new Date();

    for (const course of newCourses) {
      await Enrollment.create({
        Student_ID: studentId,
        Course_ID: course.Course_ID,
        Semester_ID: currentSemester,
        Status: '轉系加選',
        Enrollment_Date: now
      }, { transaction: t });
    }

    await t.commit();
    console.log(`學生 ${studentId} 已從 ${oldDeptId} 轉到 ${newDeptId}`);
  } catch (err) {
    await t.rollback();
    console.error('轉系處理失敗：', err);
  }
}

// 測試範例
transferStudent('S10811005', 'CS001', 'EE001');
