// transactionExample.js
const pool = require('./db');

async function doTransaction() {
  let conn;
  const studentId = 'S10811005';
  const newDeptId = 'EE001';

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // 開始交易

    // 檢查學號是否存在
    const [rows] = await conn.query('SELECT * FROM STUDENT WHERE Student_ID = ?', [studentId]);
    if (rows.length === 0) {
      throw new Error(`查無此學號：${studentId}`);
    }

    // 更新 STUDENT 的 Department_ID
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, [newDeptId, studentId]);

    // 更新 ENROLLMENT 狀態
    const updateCourses = 'UPDATE ENROLLMENT SET Status = ? WHERE Student_ID = ?';
    await conn.query(updateCourses, ['退選', studentId]);

    // 提交交易
    await conn.commit();
    console.log('交易成功，已提交');

    const [updated] = await conn.query(`
        SELECT Student_ID, Name, Department_ID
        FROM STUDENT
        WHERE Student_ID = ?
      `, [studentId]);
      
    console.log('修改後學生資料：', updated);
      
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾：', err.message);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();

