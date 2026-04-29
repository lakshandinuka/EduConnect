package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface Ticket_Repository extends JpaRepository<Ticket, String> {

    @Query(value = "SELECT COUNT(*) as totalTickets FROM tickets", nativeQuery = true)
    Map<String, Object> getTotalTickets();

    // 1. Ticket Volume by Dept (Trend Analysis)
    @Query(value = """
            SELECT DATE(created_at) as date,
                department,
                COUNT(*) as dailyCount
            FROM tickets
            WHERE department IS NOT NULL
            AND department != 'General'
            GROUP BY DATE(created_at), department
            ORDER BY date ASC
            """, nativeQuery = true)
    List<Map<String, Object>> getTicketTrendByDepartment();

    // 2. Average Resolution Time in Hours
    @Query(value = """
            SELECT
                ROUND(AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)), 2) as avgResolutionHours,
                ROUND(AVG(TIMESTAMPDIFF(HOUR, created_at, first_response_at)), 2) as avgFirstResponseHours
            FROM tickets
            WHERE resolved_at IS NOT NULL
            """, nativeQuery = true)
    Map<String, Object> getResolutionTimeStats();

    // 3. SLA Compliance (resolved within 72 hours = compliant)
    @Query(value = """
            SELECT
                COUNT(*) as total,
                SUM(CASE
                        WHEN (
                                (resolved_at IS NOT NULL AND TIMESTAMPDIFF(HOUR, created_at, resolved_at) <= 72)
                                OR
                                (resolved_at IS NULL AND TIMESTAMPDIFF(HOUR, created_at, NOW()) <= 72)
                            )
                        THEN 1
                        ELSE 0
                    END) as compliant,
                SUM(CASE
                        WHEN (
                                (resolved_at IS NOT NULL AND TIMESTAMPDIFF(HOUR, created_at, resolved_at) > 72)
                                OR
                                (resolved_at IS NULL AND TIMESTAMPDIFF(HOUR, created_at, NOW()) > 72)
                            )
                        THEN 1
                        ELSE 0
                    END) as breached
            FROM tickets """, nativeQuery = true)
    Map<String, Object> getSLACompliance();

    // 4. Sentiment Distribution
    @Query(value = """
            SELECT sentiment, COUNT(*) as count
            FROM tickets
            GROUP BY sentiment
            """, nativeQuery = true)
    List<Map<String, Object>> getSentimentDistribution();

    // 5. Tickets by Status
    @Query(value = """
            SELECT status, COUNT(*) as count
            FROM tickets
            GROUP BY status
            """, nativeQuery = true)
    List<Map<String, Object>> getTicketsByStatus();

    // 6. Agent Workload
    @Query(value = """
            SELECT agent_name, COUNT(*) as ticketCount,
                   ROUND(AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)), 2) as avgResolutionHours
            FROM tickets
            WHERE agent_name IS NOT NULL
            GROUP BY agent_name
            ORDER BY ticketCount DESC
            """, nativeQuery = true)
    List<Map<String, Object>> getAgentWorkload();

    // 7. Average Satisfaction Score
    @Query(value = """
            SELECT ROUND(AVG(satisfaction_score), 2) as avgScore
            FROM tickets
            WHERE satisfaction_score IS NOT NULL
            """, nativeQuery = true)
    Map<String, Object> getAvgSatisfactionScore();

    // Moving Average Trend
    @Query(value = """
            SELECT
                DATE(t1.created_at) as date,
                COUNT(t1.ticket_id) as dailyCount,
                ROUND(AVG(COUNT(t2.ticket_id)) OVER (
                    ORDER BY DATE(t1.created_at)
                    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
                ), 1) as movingAvg
            FROM tickets t1
            JOIN tickets t2 ON DATE(t2.created_at) BETWEEN
                DATE_SUB(DATE(t1.created_at), INTERVAL 6 DAY)
                AND DATE(t1.created_at)
            GROUP BY DATE(t1.created_at)
            ORDER BY date ASC
            """, nativeQuery = true)
    List<Map<String, Object>> getTicketTrendWithMovingAvg();

    // Anomaly Detection - 24 features matching model
    @Query(value = """
            SELECT
                t.ticket_id,
                COALESCE(t.department_id, 1) as department_id,
                CASE t.category
                    WHEN 'Technical Issue' THEN 1
                    WHEN 'Account & Login' THEN 2
                    WHEN 'Payment & Billing' THEN 3
                    WHEN 'Enrollment' THEN 4
                    WHEN 'Library Access' THEN 5
                    WHEN 'Exam & Assessment' THEN 6
                    WHEN 'General Inquiry' THEN 7
                    WHEN 'Course Access' THEN 8
                    ELSE 1 END as category_id,
                CASE t.priority
                    WHEN 'LOW' THEN 1
                    WHEN 'MEDIUM' THEN 2
                    WHEN 'HIGH' THEN 3
                    WHEN 'CRITICAL' THEN 4
                    ELSE 2 END as priority_id,
                COALESCE(t.channel_id, 3) as channel_id,
                25 as customer_age,
                COUNT(*) OVER (PARTITION BY HOUR(t.created_at)) as ticket_volume_per_hour,
                COALESCE(TIMESTAMPDIFF(MINUTE, t.created_at, t.first_response_at), 30) as avg_response_time_mins,
                COALESCE(TIMESTAMPDIFF(MINUTE, t.created_at, t.resolved_at), 120) as resolution_time_mins,
                CASE WHEN t.resolved_at IS NOT NULL
                     AND TIMESTAMPDIFF(HOUR, t.created_at, t.resolved_at) > 72
                     THEN 1 ELSE 0 END as sla_breach,
                COALESCE(t.reassignment_count, 0) as reassignment_count,
                HOUR(t.created_at) as hour_of_day,
                DAYOFWEEK(t.created_at) as day_of_week,
                (SELECT COUNT(*) FROM tickets t2
                 WHERE t2.agent_name = t.agent_name
                 AND t2.status != 'CLOSED') as agent_workload_score,
                COALESCE(t.ticket_reopen_count, 0) as ticket_reopen_count,
                COALESCE(t.message_count, 1) as message_count,
                COALESCE(t.escalated, 0) as escalated,
                COALESCE(t.satisfaction_score, 3) as satisfaction_score,
                COALESCE(t.time_to_first_escalation_mins, 0) as time_to_first_escalation_mins,
                COALESCE(t.num_attachments, 0) as num_attachments,
                CASE WHEN DAYOFWEEK(t.created_at) IN (1,7) THEN 1 ELSE 0 END as is_weekend,
                COALESCE(t.previous_tickets_by_customer, 0) as previous_tickets_by_customer,
                COALESCE(t.knowledge_base_used, 0) as knowledge_base_used,
                COALESCE(t.auto_categorized, 0) as auto_categorized,
                COALESCE(t.duplicate_flag, 0) as duplicate_flag
            FROM tickets t
            WHERE t.created_at IS NOT NULL
            """, nativeQuery = true)
    List<Map<String, Object>> getTicketFeaturesForAnomaly();
}