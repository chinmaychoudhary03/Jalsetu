const getStats = async (req, res, next) => {
  try {
    // ── Mock mode ──────────────────────────────────────────────────────────
    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      return res.json(mock.dashboardStats);
    }

    // ── Real DB mode ───────────────────────────────────────────────────────
    const db = require('../db/connection');
    const [
      assetsResult, maintenanceResult,
      inventoryTotalResult, inventoryLowResult, inventoryReplenishResult,
      financeResult, billsResult, billsPendingAmountResult,
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='operational') AS operational,
        COUNT(*) FILTER (WHERE status='needs_attention') AS needs_attention,
        COUNT(*) FILTER (WHERE status='under_maintenance') AS under_maintenance,
        COUNT(*) FILTER (WHERE status='non_operational') AS non_operational
        FROM assets`),
      db.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='reported') AS reported,
        COUNT(*) FILTER (WHERE status='assigned') AS assigned,
        COUNT(*) FILTER (WHERE status='in_progress') AS in_progress,
        COUNT(*) FILTER (WHERE status='completed') AS completed
        FROM maintenance`),
      db.query('SELECT COUNT(*) AS total FROM inventory'),
      db.query('SELECT COUNT(*) AS count FROM inventory WHERE quantity < min_quantity AND quantity > 0'),
      db.query('SELECT COUNT(*) AS count FROM inventory WHERE quantity = 0 OR quantity <= (min_quantity * 0.5)'),
      db.query(`SELECT
        COALESCE(SUM(amount) FILTER (WHERE type='receipt'),0) AS total_receipts,
        COALESCE(SUM(amount) FILTER (WHERE type='expenditure'),0) AS total_expenditure,
        COALESCE(SUM(CASE WHEN type='receipt' THEN amount WHEN type='expenditure' THEN -amount END),0) AS balance
        FROM finance_transactions`),
      db.query(`SELECT COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status='paid') AS paid,
        COUNT(*) FILTER (WHERE status='pending') AS pending,
        COUNT(*) FILTER (WHERE status='overdue') AS overdue
        FROM bills`),
      db.query(`SELECT COALESCE(SUM(amount),0) AS pending_amount FROM bills WHERE status IN ('pending','overdue')`),
    ]);

    const a = assetsResult.rows[0];
    const m = maintenanceResult.rows[0];
    res.json({
      assets: {
        total: parseInt(a.total), operational: parseInt(a.operational),
        needs_attention: parseInt(a.needs_attention), under_maintenance: parseInt(a.under_maintenance),
        non_operational: parseInt(a.non_operational),
      },
      maintenance: {
        total: parseInt(m.total), reported: parseInt(m.reported), assigned: parseInt(m.assigned),
        in_progress: parseInt(m.in_progress), completed: parseInt(m.completed),
        open: parseInt(m.reported) + parseInt(m.assigned),
      },
      inventory: {
        total: parseInt(inventoryTotalResult.rows[0].total),
        low_stock: parseInt(inventoryLowResult.rows[0].count),
        replenishment_required: parseInt(inventoryReplenishResult.rows[0].count),
      },
      finance: {
        total_receipts: parseFloat(financeResult.rows[0].total_receipts),
        total_expenditure: parseFloat(financeResult.rows[0].total_expenditure),
        balance: parseFloat(financeResult.rows[0].balance),
      },
      bills: {
        total: parseInt(billsResult.rows[0].total),
        paid: parseInt(billsResult.rows[0].paid),
        pending: parseInt(billsResult.rows[0].pending),
        overdue: parseInt(billsResult.rows[0].overdue),
        pending_amount: parseFloat(billsPendingAmountResult.rows[0].pending_amount),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
