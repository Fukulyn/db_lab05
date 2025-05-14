// ormQueryExample.js
const { Student, Course, Enrollment } = require('./models/index');

async function findUngraded() {
  try {
    const results = await Enrollment.findAll({
      where: { Grade: null },
      include: [
        {
          model: Student,
          attributes: ['Student_ID', 'Name']
        },
        {
          model: Course,
          attributes: ['Course_ID', 'Title']
        }
      ]
    });

    console.log('未評分的選課記錄：');
    results.forEach(record => {
      console.log(`學生：${record.Student.Name} (${record.Student.Student_ID}), 課程：${record.Course.Title} (${record.Course.Course_ID})`);
    });

    return results;
  } catch (err) {
    console.error('查詢失敗：', err);
  }
}

findUngraded();
