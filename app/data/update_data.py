import json
import time
import random
from copy import deepcopy
from datetime import datetime, timedelta, timezone

INPUT_FILE = "app/data/dashboard.json"
OUTPUT_FILE = "app/data/dashboard.json"

# Load data
def load_data(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# Save data
def save_data(path: str, data: dict) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# Parse ISO
def parse_iso(ts: str) -> datetime:
    if ts.endswith("Z"):
        ts = ts[:-1] + "+00:00"
    return datetime.fromisoformat(ts)

# ISO now
def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

# Jitter value
def jitter_value(val: int | float, pct: float = 0.02) -> int | float:
    delta = val * pct
    return val + random.uniform(-delta, delta)

# Clamp
def clamp(val, min_val, max_val):
    return max(min_val, min(max_val, val))

# Compute totals from top APIs
def compute_totals_from_top_apis(data: dict) -> None:
    top_apis = data.get("topApis", [])
    total_apis = len(top_apis)
    total_requests_from_apis = sum(a["requests"] for a in top_apis)

    data["summary"]["totalApis"] = total_apis

    if total_requests_from_apis == 0:
        total_requests_from_apis = 1

    approx_errors = 0
    for api in top_apis:
        r = api["requests"]
        er = api["errorRatePercent"] / 100.0
        approx_errors += int(r * er)

    total_requests = max(0, int(jitter_value(total_requests_from_apis, 0.01)))
    total_errors = max(0, int(jitter_value(approx_errors, 0.05)))

    data["summary"]["totalRequests"] = total_requests
    if total_requests:
        data["summary"]["errorRatePercent"] = round(
            (total_errors / total_requests) * 100, 2
        )
    else:
        data["summary"]["errorRatePercent"] = 0.0

# Update traffic by hour from totals
def update_traffic_by_hour_from_totals(data: dict) -> None:
    hours = data["trafficByHour"]
    total_requests_target = data["summary"]["totalRequests"]
    global_err_rate = data["summary"]["errorRatePercent"] / 100.0

    current_total = sum(h["requests"] for h in hours) or 1
    weights = [h["requests"] / current_total for h in hours]

    new_requests = []
    for w in weights:
        new_requests.append(int(total_requests_target * w))

    diff = total_requests_target - sum(new_requests)
    idxs_by_weight = sorted(range(len(hours)), key=lambda i: weights[i], reverse=True)
    i = 0
    while diff != 0 and idxs_by_weight:
        idx = idxs_by_weight[i % len(idxs_by_weight)]
        if diff > 0:
            new_requests[idx] += 1
            diff -= 1
        else:
            if new_requests[idx] > 0:
                new_requests[idx] -= 1
                diff += 1
        i += 1

    for i, h in enumerate(hours):
        h["requests"] = max(0, int(jitter_value(new_requests[i], 0.002)))
        expected_errors = int(h["requests"] * global_err_rate)
        h["errors"] = max(0, int(jitter_value(expected_errors, 0.05)))
        h["avgLatencyMs"] = max(1, int(jitter_value(h["avgLatencyMs"], 0.01)))

# Update summary from hourly
def update_summary_from_hourly(data: dict) -> None:
    total_requests = sum(h["requests"] for h in data["trafficByHour"])
    total_errors = sum(h["errors"] for h in data["trafficByHour"])

    data["summary"]["totalRequests"] = total_requests

    if total_requests:
        total_latency_weighted = sum(
            h["avgLatencyMs"] * h["requests"] for h in data["trafficByHour"]
        )
        data["summary"]["avgLatencyMs"] = int(total_latency_weighted / total_requests)
        data["summary"]["errorRatePercent"] = round(
            (total_errors / total_requests) * 100, 2
        )
    else:
        data["summary"]["avgLatencyMs"] = 0
        data["summary"]["errorRatePercent"] = 0.0

    data["summary"]["activeConsumers"] = len(data.get("topConsumers", []))

# Update status codes
def update_status_codes(data: dict) -> None:
    total_requests = data["summary"]["totalRequests"]
    if total_requests == 0:
        for c in data["statusCodes"]:
            c["count"] = 0
        return

    error_rate = data["summary"]["errorRatePercent"] / 100.0

    total_errors = int(total_requests * error_rate)
    total_success = total_requests - total_errors

    err400 = int(total_errors * 0.35)
    err401 = int(total_errors * 0.15)
    err404 = int(total_errors * 0.25)
    err500 = total_errors - (err400 + err401 + err404)

    mapping = {
        200: total_success,
        400: err400,
        401: err401,
        404: err404,
        500: err500,
    }

    for c in data["statusCodes"]:
        code = c["code"]
        c["count"] = max(0, mapping.get(code, 0))

# Update KPIs
def update_kpis(data: dict) -> None:
    summary = data["summary"]
    total_requests = summary["totalRequests"]

    if total_requests:
        busiest_hour = max(data["trafficByHour"], key=lambda h: h["requests"])
        peak_rps = busiest_hour["requests"] // 3600
    else:
        peak_rps = 0

    for kpi in data["kpis"]:
        if kpi["id"] == "requests":
            kpi["value"] = total_requests
        elif kpi["id"] == "latency":
            kpi["value"] = summary["avgLatencyMs"]
        elif kpi["id"] == "errors":
            kpi["value"] = summary["errorRatePercent"]
        elif kpi["id"] == "throughput":
            kpi["value"] = peak_rps


# Update top APIs
def update_top_apis(data: dict) -> None:
    for api in data["topApis"]:
        api["p95LatencyMs"] = max(
            20, int(jitter_value(api["p95LatencyMs"], 0.05))
        )
        api["errorRatePercent"] = round(
            clamp(jitter_value(api["errorRatePercent"], 0.1), 0.0, 10.0), 2
        )
        api["requests"] = max(
            0, int(jitter_value(api["requests"], 0.02))
        )

# Update top consumers
def update_top_consumers(data: dict) -> None:
    now = datetime.now(timezone.utc)
    for consumer in data["topConsumers"]:
        consumer["requests"] = max(
            0, int(jitter_value(consumer["requests"], 0.01))
        )
        last_seen = parse_iso(consumer["lastSeen"])
        last_seen += timedelta(seconds=random.randint(0, 2))
        if last_seen > now:
            last_seen = now
        consumer["lastSeen"] = last_seen.isoformat().replace("+00:00", "Z")

# Ensure alert has all required fields
def ensure_alert_fields(alert: dict) -> None:
    now = iso_now()
    if "status" not in alert:
        alert["status"] = "resolved"
    if "firstSeenAt" not in alert:
        alert["firstSeenAt"] = now
    if "lastStatusChangeAt" not in alert:
        alert["lastStatusChangeAt"] = now
    if "history" not in alert:
        alert["history"] = []

def push_alert_history(alert: dict, new_status: str) -> None:
    now = iso_now()
    alert["history"].append({
        "status": new_status,
        "at": now,
    })
    alert["lastStatusChangeAt"] = now

def compute_alert_desired_status(alert: dict, data: dict) -> str:
    apis_by_name = {api["name"]: api for api in data.get("topApis", [])}
    status = "resolved"

    if alert["id"] == "ALT-1":
        billing = apis_by_name.get("Billing Service")
        if billing:
            err = billing["errorRatePercent"]
            if err < 0.5:
                status = random.choices(
                    ["resolved", "firing"],
                    weights=[0.8, 0.2],
                    k=1
                )[0]
            elif err < 1.0:
                status = random.choices(
                    ["resolved", "firing"],
                    weights=[0.4, 0.6],
                    k=1
                )[0]
            else:
                status = random.choices(
                    ["firing", "ticket_open"],
                    weights=[0.5, 0.5],
                    k=1
                )[0]

    elif alert["id"] == "ALT-2":
        auth = apis_by_name.get("Auth Service")
        if auth:
            p95 = auth["p95LatencyMs"]
            if p95 < 50:
                status = random.choices(
                    ["resolved", "firing"],
                    weights=[0.8, 0.2],
                    k=1
                )[0]
            elif p95 <= 100:
                status = random.choices(
                    ["resolved", "firing"],
                    weights=[0.4, 0.6],
                    k=1
                )[0]
            else:
                status = random.choices(
                    ["firing", "ticket_open"],
                    weights=[0.5, 0.5],
                    k=1
                )[0]

    return status

# Update all alerts
def update_alerts(data: dict) -> None:

    alerts = data.get("alerts", [])
    now_dt = datetime.now(timezone.utc)

    for alert in alerts:
        ensure_alert_fields(alert)

        current_status = alert["status"]
        desired_status = compute_alert_desired_status(alert, data)

        # If ticket is open/firing for > 5 seconds, auto-set to resolved
        last_change = parse_iso(alert["lastStatusChangeAt"])
        open_for = (now_dt - last_change).total_seconds()

        if current_status in ("firing", "ticket_open") and open_for > 5:
            # force resolve after 5 seconds
            desired_status = "resolved"

        # Update status
        if desired_status != current_status:
            alert["status"] = desired_status
            if desired_status == "ticket_open" and alert["severity"] == "medium":
                alert["severity"] = "high"
            push_alert_history(alert, desired_status)

    
    # Derived list: only show "open" tickets (firing or ticket_open)
    data["openTickets"] = [
        a for a in alerts
        if a["status"] in ("firing", "ticket_open")
    ]

# Update time Stamp
def update_meta(data: dict) -> None:
    data["meta"]["generatedAt"] = iso_now()
    data["meta"]["timeRange"] = "last_24h"

# Ticket Generator
def tick(data: dict) -> dict:
    data = deepcopy(data)

    update_top_apis(data)
    update_top_consumers(data)
    compute_totals_from_top_apis(data)
    update_traffic_by_hour_from_totals(data)
    update_summary_from_hourly(data)
    update_status_codes(data)
    update_kpis(data)
    update_alerts(data)
    update_meta(data)

    return data

def main():
    data = load_data(INPUT_FILE)

    while True:
        data = tick(data)
        save_data(OUTPUT_FILE, data)
        print(f"[{iso_now()}] updated {OUTPUT_FILE}")
        time.sleep(1)

if __name__ == "__main__":
    main()
