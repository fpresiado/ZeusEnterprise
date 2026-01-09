# Observability & SRE

## Required endpoints
- `/health`: process alive
- `/ready`: dependencies reachable
- `/version`: git sha/build

## Logging standard
All services log JSON lines with at least:
- timestamp
- level
- service
- request_id
- trace_id (if available)
- event
- error (if any)

## Autonomy metrics
For each iteration:
- iteration number
- gate that failed (doctor/build/test)
- time spent
- estimated token/cost spend
- repeated failure signature count

## Alerts (placeholders)
- readiness failing > 2 min
- error rate > 2% over 5 min
- autonomy budget 80% used
