import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import os

MODEL_PATH = "model.pkl"
SCALER_PATH = "scaler.pkl"

FEATURES = [
    'department_id', 'category_id', 'priority_id', 'channel_id',
    'customer_age', 'ticket_volume_per_hour', 'avg_response_time_mins',
    'resolution_time_mins', 'sla_breach', 'reassignment_count',
    'hour_of_day', 'day_of_week', 'agent_workload_score',
    'ticket_reopen_count', 'message_count', 'escalated',
    'satisfaction_score', 'time_to_first_escalation_mins',
    'num_attachments', 'is_weekend', 'previous_tickets_by_customer',
    'knowledge_base_used', 'auto_categorized', 'duplicate_flag'
]

def detect_reason(row):
    reasons = []
    try:
        if float(row.get('resolution_time_mins', 0)) > 1440:
            reasons.append("Extremely long resolution time")
        if float(row.get('agent_workload_score', 0)) > 20:
            reasons.append("Agent overload detected")
        if float(row.get('reassignment_count', 0)) >= 3:
            reasons.append("Excessive reassignments")
        if float(row.get('ticket_reopen_count', 0)) >= 2:
            reasons.append("Ticket reopened multiple times")
        if float(row.get('sla_breach', 0)) == 1:
            reasons.append("SLA breach")
        if float(row.get('hour_of_day', 12)) <= 5 and float(row.get('ticket_volume_per_hour', 0)) > 20:
            reasons.append("Late night volume spike")
        if float(row.get('avg_response_time_mins', 0)) > 300:
            reasons.append("Very slow first response")
        if float(row.get('escalated', 0)) == 1:
            reasons.append("Ticket escalated")
    except:
        pass
    return reasons if reasons else ["Unusual pattern detected"]

def preprocess(df):
    for col in FEATURES:
        if col not in df.columns:
            df[col] = 0
    df = df[FEATURES]
    df = df.fillna(0)
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
    return df

def predict_anomalies(df):
    if not os.path.exists(MODEL_PATH):
        return {"error": "model.pkl not found."}

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    original_ids = df['ticket_id'].tolist() if 'ticket_id' in df.columns else list(range(len(df)))

    processed = preprocess(df.copy())
    X = scaler.transform(processed)

    scores = model.decision_function(X)
    predictions = model.predict(X)

    score_threshold = float(np.percentile(scores, 10))

    results = []
    for i, (score, pred) in enumerate(zip(scores, predictions)):
        if pred == -1 and score <= score_threshold:
            raw_row = df.iloc[i].to_dict()
            reasons = detect_reason(raw_row)
            results.append({
                "ticket_id": original_ids[i],
                "anomaly_score": round(float(score), 4),
                "is_anomaly": True,
                "severity": "HIGH" if score < -0.20 else "MEDIUM",
                "reasons": reasons,
                "resolution_time_mins": int(float(raw_row.get('resolution_time_mins', 0))),
                "agent_workload_score": int(float(raw_row.get('agent_workload_score', 0))),
                "reassignment_count": int(float(raw_row.get('reassignment_count', 0))),
                "sla_breach": int(float(raw_row.get('sla_breach', 0))),
                "hour_of_day": int(float(raw_row.get('hour_of_day', 0)))
            })

    results.sort(key=lambda x: x["anomaly_score"])

    return {
        "anomalies": results,
        "total_checked": len(df),
        "total_anomalies": len(results)
    }