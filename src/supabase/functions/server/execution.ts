import { Context } from "npm:hono";
import * as kv from "./kv_store.tsx";

interface ExecutionLog {
  id: string;
  founder_id: string;
  week_number: number;
  date: string;
  hours: number;
  description: string;
  revenue_impact: number;
  created_at: string;
}

// Get execution logs for a founder's specific week
export async function getExecutionLogs(c: Context) {
  try {
    const founderId = c.req.param("founderId");
    const weekNumber = c.req.param("weekNumber");
    
    // Get all execution logs for this founder and week
    const allLogs = await kv.getByPrefix(`execution_log_${founderId}_week${weekNumber}_`);
    
    // Sort by date descending
    const sortedLogs = (allLogs || []).sort((a: ExecutionLog, b: ExecutionLog) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return c.json({ success: true, logs: sortedLogs });
  } catch (error) {
    console.error("Error fetching execution logs:", error);
    return c.json({ error: "Failed to fetch execution logs" }, 500);
  }
}

// Create new execution log
export async function createExecutionLog(c: Context) {
  try {
    const body = await c.req.json();
    const { founder_id, week_number, date, hours, description, revenue_impact } = body;
    
    if (!founder_id || !week_number || !date || !hours || !description) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    if (hours <= 0) {
      return c.json({ error: "Hours must be greater than 0" }, 400);
    }
    
    const id = crypto.randomUUID();
    const log: ExecutionLog = {
      id,
      founder_id,
      week_number,
      date,
      hours,
      description,
      revenue_impact: revenue_impact || 0,
      created_at: new Date().toISOString()
    };
    
    // Save log with composite key: execution_log_{founderId}_week{weekNumber}_{id}
    await kv.set(`execution_log_${founder_id}_week${week_number}_${id}`, log);
    
    return c.json({ success: true, log }, 201);
  } catch (error) {
    console.error("Error creating execution log:", error);
    return c.json({ error: "Failed to create execution log" }, 500);
  }
}

// Update execution log
export async function updateExecutionLog(c: Context) {
  try {
    const logId = c.req.param("id");
    const body = await c.req.json();
    
    // Find the log by searching all execution logs
    const allLogs = await kv.getByPrefix("execution_log_");
    const existingLog = allLogs.find((log: ExecutionLog) => log.id === logId);
    
    if (!existingLog) {
      return c.json({ error: "Log not found" }, 404);
    }
    
    const updatedLog: ExecutionLog = {
      ...existingLog,
      ...body,
      id: existingLog.id, // Preserve ID
      founder_id: existingLog.founder_id, // Preserve founder
      week_number: existingLog.week_number // Preserve week
    };
    
    // Update with same key structure
    await kv.set(
      `execution_log_${existingLog.founder_id}_week${existingLog.week_number}_${logId}`,
      updatedLog
    );
    
    return c.json({ success: true, log: updatedLog });
  } catch (error) {
    console.error("Error updating execution log:", error);
    return c.json({ error: "Failed to update execution log" }, 500);
  }
}

// Delete execution log
export async function deleteExecutionLog(c: Context) {
  try {
    const logId = c.req.param("id");
    
    // Find the log first
    const allLogs = await kv.getByPrefix("execution_log_");
    const logToDelete = allLogs.find((log: ExecutionLog) => log.id === logId);
    
    if (!logToDelete) {
      return c.json({ error: "Log not found" }, 404);
    }
    
    // Delete using the composite key
    await kv.del(`execution_log_${logToDelete.founder_id}_week${logToDelete.week_number}_${logId}`);
    
    return c.json({ success: true, message: "Log deleted successfully" });
  } catch (error) {
    console.error("Error deleting execution log:", error);
    return c.json({ error: "Failed to delete execution log" }, 500);
  }
}

// Get total hours for a founder's week
export async function getWeekTotalHours(c: Context) {
  try {
    const founderId = c.req.param("founderId");
    const weekNumber = c.req.param("weekNumber");
    
    const logs = await kv.getByPrefix(`execution_log_${founderId}_week${weekNumber}_`);
    
    const totalHours = (logs || []).reduce((sum: number, log: ExecutionLog) => {
      return sum + log.hours;
    }, 0);
    
    const totalRevenue = (logs || []).reduce((sum: number, log: ExecutionLog) => {
      return sum + (log.revenue_impact || 0);
    }, 0);
    
    return c.json({ 
      success: true, 
      totalHours, 
      totalRevenue,
      logCount: logs.length,
      revenuePerHour: totalHours > 0 ? totalRevenue / totalHours : 0
    });
  } catch (error) {
    console.error("Error calculating week totals:", error);
    return c.json({ error: "Failed to calculate totals" }, 500);
  }
}
