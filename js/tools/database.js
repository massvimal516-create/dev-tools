const dbOut = msg =>
    document.getElementById('databaseOutput').textContent = msg;

// ---------- SQL QUERY BUILDER ----------
function buildSql() {
    const table = document.getElementById('sqlTable').value;
    const columns = document.getElementById('sqlColumns').value || '*';
    const where = document.getElementById('sqlWhere').value;

    if (!table) {
        dbOut('Table name is required ❌');
        return;
    }

    let sql = `SELECT ${columns} FROM ${table}`;
    if (where) sql += ` WHERE ${where}`;

    dbOut(sql + ';');
}

// ---------- SQL EXPLAIN (EDUCATIONAL) ----------
function explainSql() {
    const sql = document.getElementById('explainInput').value;

    if (!sql.toLowerCase().includes('select')) {
        dbOut('Only SELECT queries supported ❌');
        return;
    }

    dbOut(
        `EXPLAIN PLAN (Simulated):
- Query Type: SELECT
- Table Scan: Likely
- Index Usage: Depends on WHERE clause
- Cost Estimate: Medium
- Notes: Add indexes to improve performance`
    );
}

// ---------- MONGODB FORMATTER ----------
function formatMongo() {
    try {
        const text = document.getElementById('mongoInput').value;
        const formatted = text
            .replace(/,/g, ',\n  ')
            .replace(/{/g, '{\n  ')
            .replace(/}/g, '\n}');
        dbOut(formatted);
    } catch {
        dbOut('Invalid Mongo query ❌');
    }
}

// ---------- SCHEMA VIEWER ----------
function viewSchema() {
    try {
        const schema = JSON.parse(
            document.getElementById('schemaInput').value
        );

        let output = 'Database Schema:\n\n';

        for (const table in schema) {
            output += `${table}:\n`;
            schema[table].forEach(col => {
                output += `  - ${col}\n`;
            });
            output += '\n';
        }

        dbOut(output);
    } catch {
        dbOut('Invalid schema JSON ❌');
    }
}

// ---------- DUMMY DATA GENERATOR ----------
function generateDummyData() {
    const count = Number(document.getElementById('dummyCount').value) || 5;

    const data = [];

    for (let i = 1; i <= count; i++) {
        data.push({
            id: i,
            name: `User${i}`,
            email: `user${i}@example.com`,
            createdAt: new Date().toISOString()
        });
    }

    dbOut(JSON.stringify(data, null, 4));
}
