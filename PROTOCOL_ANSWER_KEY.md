# Protocol Evaluation - Answer Key & Scoring Guide

## Module 1: Mathematical Intuition (30 Points)

### Question
Fraud detection model with 99.9% accuracy on imbalanced dataset (99.9% legitimate, 0.1% fraud).

### Options
- A) The model is overfitted to the training data.
- B) The accuracy metric is misleading due to class imbalance; Recall is near 0. ✅
- C) The learning rate was too high during training.
- D) The model needs more epochs to converge properly.

### Correct Answer: **B**

### Why?
With extreme class imbalance, a model can achieve 99.9% accuracy by simply predicting "legitimate" for every transaction. The model has high accuracy but fails to catch fraud (Recall ≈ 0%). This is a fundamental understanding test - only top engineers immediately recognize this trap.

---

## Module 2: Production Incident (40 Points)

### The Bug
```python
def process_checkout(user_id, cart):
    db = get_db_connection()  # Line 2: Connection acquired
    try:
        if check_inventory(cart):  # Line 4
            charge_user(user_id)   # Line 5
            # CRITICAL ERROR: Connection not closed  # Line 6
            return "Success"       # Line 7
    except Exception as e:
        log_error(e)
```

### Correct Answer: **Line 5 or Line 6**

### Why?
The database connection is acquired but never closed. Under normal load, this works fine. Under Black Friday traffic (high load), the connection pool exhausts because connections leak. This is a **resource leak** - a classic production bug that only appears at scale.

### The Fix
```python
def process_checkout(user_id, cart):
    with get_db_connection() as db:  # Context manager ensures cleanup
        if check_inventory(cart):
            charge_user(user_id)
            return "Success"
```

### What This Tests
- Understanding of resource management
- Systems thinking (not just syntax)
- Production awareness (how bugs manifest under load)

---

## Module 3: Architecture (30 Points)

### Requirement
Store live location of 100,000+ drivers updating every 3 seconds.

### Correct Answer Keywords
- "Redis" (with geospatial indexing)
- "In-memory" (storage/database/cache)
- "TTL" (Time to Live)
- "Ephemeral" (data)
- "Write-heavy" (workload recognition)

### Why These Solutions Work
1. **Redis with Geospatial Commands:**
   - `GEOADD` for storing locations
   - `GEORADIUS` for finding nearby drivers
   - In-memory = sub-50ms latency
   - Built-in TTL for session cleanup

2. **In-Memory Alternatives:**
   - Memcached + geohashing
   - Apache Ignite
   - Hazelcast

### Wrong Answers (Common Mistakes)
- ❌ **PostgreSQL/MySQL:** Too slow for write-heavy loads (33,333 writes/sec)
- ❌ **MongoDB:** Overkill, slower than in-memory, writes to disk
- ❌ **DynamoDB:** Possible but expensive at this scale
- ❌ "Scale the database" - Doesn't solve the architectural mismatch

### What This Tests
- Understanding write-heavy vs read-heavy workloads
- In-memory vs disk-based storage trade-offs
- Real-time system design
- Cost-awareness (ephemeral data doesn't need persistence)

---

## Scoring Breakdown

| Module | Points | What It Measures |
|--------|--------|------------------|
| Math | 30 | AI/ML fundamentals |
| Incident | 40 | Production debugging |
| Architecture | 30 | System design |
| **Total** | **100** | **Engineering maturity** |

### Pass Threshold: 90/100

### Percentile Rankings
- **80-100%:** Top 20% (Strong)
- **50-79%:** Top 50% (Moderate)
- **20-49%:** Bottom 50% (Weak)
- **0-19%:** Bottom 10% (Critical gap)

---

## Failure Patterns & Remediation

### Pattern 1: Failed Math + Passed System Design
**Profile:** Strong practical skills, weak ML theory
**Gap:** Mathematical foundations for AI
**Cohort Focus:** Stats, probability, linear algebra

### Pattern 2: Passed Math + Failed Incident
**Profile:** Academic strength, no production experience
**Gap:** System reliability, debugging, resource management
**Cohort Focus:** SRE practices, monitoring, incident response

### Pattern 3: Failed Architecture
**Profile:** Junior-level thinking, no infrastructure exposure
**Gap:** Large-scale system design, database selection
**Cohort Focus:** Distributed systems, CAP theorem, architectural patterns

### Pattern 4: Failed All
**Profile:** Fundamental skill gap
**Gap:** Needs comprehensive bootcamp
**Cohort Focus:** Full-stack engineering fundamentals

---

## Testing Cheat Sheet

### Quick Pass (90+ Points)
```
Module 1: B
Module 2: Line 5 or 6
Module 3: Type "Redis with geospatial indexing"
```

### Quick Fail (< 90 Points)
```
Module 1: A, C, or D
Module 2: Any line except 5 or 6
Module 3: Type "MySQL" or "MongoDB"
```

---

## Philosophy: Why These Questions?

### Not Googleable
- Module 1: Requires intuition, not formula
- Module 2: The code "works" - no syntax error
- Module 3: Requires cost/latency/scale trade-off analysis

### Real Interview Questions
- **Module 1:** Asked at Meta, Google (ML roles)
- **Module 2:** Classic Amazon LP (bias for action, dive deep)
- **Module 3:** Standard Netflix, Uber system design

### Tests Synthesis
Each question requires combining:
- **Math:** Probability, distributions, metrics
- **Code:** Reading, debugging, resource management
- **Business:** Cost, scale, user experience

---

## Next-Level Questions (Future V2)

### Math Module Ideas
- Gradient descent convergence (learning rate)
- Bias-variance trade-off scenario
- Dimensionality curse with high-D data

### Incident Module Ideas
- Race condition in multi-threaded code
- SQL N+1 query problem
- Cache invalidation bug

### Architecture Module Ideas
- Design a URL shortener (write-heavy)
- Design a rate limiter (read-heavy)
- Design a distributed cache

---

## Psychological Design

### Why This Works
1. **Respects the Candidate:** No tricks, no gotchas
2. **Earns Trust:** Legitimate failure = legitimate cohort value
3. **Creates Urgency:** Specific gap = clear path forward
4. **Maintains Brand:** "Data Buffet doesn't play games"

### Failure UX Goals
- ❌ **NOT:** "You suck" (demoralizing)
- ✅ **YES:** "You have potential but critical gaps" (motivating)

### Gap Report Language
- "Strong mathematical potential" (positive framing)
- "Critical failure in System Design" (honest diagnosis)
- "This specific gap is fixable" (hope + CTA)

---

## Monitoring Metrics (Future)

### Success Metrics
- **Completion Rate:** % who finish all 3 modules
- **Pass Rate:** % scoring 90+
- **Time Distribution:** Average time per module
- **Conversion Rate:** % of failures who join cohort

### Quality Metrics
- **False Positive Rate:** Passers who fail real interviews
- **False Negative Rate:** Failers who were actually qualified

---

## Conclusion

This is not a test of memorization. It's a test of **Engineering Judgment**.

The top 0.1% don't need to memorize. They understand.
