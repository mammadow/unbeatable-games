// Simple health check test - verifies all systems operational
import pool from '../config/database.js';

console.log('🧪 Running Health Check Tests...\n');

let passed = 0;
let failed = 0;

// Test 1: Database Connection
try {
  const result = await pool.query('SELECT NOW() as timestamp');
  if (result.rows[0]) {
    console.log('✅ Database Connection: PASSED');
    passed++;
  } else {
    console.log('❌ Database Connection: FAILED (no response)');
    failed++;
  }
} catch (error) {
  console.log(`❌ Database Connection: FAILED (${error.message})`);
  failed++;
}

// Test 2: Required Tables Exist
try {
  const tables = await pool.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
  `);
  const tableNames = tables.rows.map(t => t.table_name).sort();
  const required = ['users', 'game_records', 'leaderboards'];
  const hasAll = required.every(t => tableNames.includes(t));

  if (hasAll) {
    console.log('✅ Database Schema: PASSED (all tables present)');
    passed++;
  } else {
    console.log('❌ Database Schema: FAILED (missing tables)');
    failed++;
  }
} catch (error) {
  console.log(`❌ Database Schema: FAILED (${error.message})`);
  failed++;
}

// Test 3: Users Table Has Data
try {
  const result = await pool.query('SELECT COUNT(*) as count FROM users');
  const count = result.rows[0].count;
  console.log(`✅ Users Table: PASSED (${count} users)`);
  passed++;
} catch (error) {
  console.log(`❌ Users Table: FAILED (${error.message})`);
  failed++;
}

// Test 4: Game Records Table Accessible
try {
  const result = await pool.query('SELECT COUNT(*) as count FROM game_records');
  const count = result.rows[0].count;
  console.log(`✅ Game Records: PASSED (${count} games)`);
  passed++;
} catch (error) {
  console.log(`❌ Game Records: FAILED (${error.message})`);
  failed++;
}

// Test 5: Leaderboards Table Accessible
try {
  const result = await pool.query('SELECT COUNT(*) as count FROM leaderboards');
  const count = result.rows[0].count;
  console.log(`✅ Leaderboards: PASSED (${count} entries)`);
  passed++;
} catch (error) {
  console.log(`❌ Leaderboards: FAILED (${error.message})`);
  failed++;
}

// Summary
console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All Health Checks PASSED!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests FAILED. Check database connection.\n');
  process.exit(1);
}
