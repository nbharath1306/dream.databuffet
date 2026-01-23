# Quick Test Guide - Impossible Protocol

## Access the Test
Navigate to: `http://localhost:3000/test`

## Test Flow

### 1. Intro Screen
- See "THE IMPOSSIBLE PROTOCOL" title
- 3 warning cards about anti-cheat
- Click "Initialize Protocol"

### 2. Employee Handbook
- Read the handbook carefully
- **IMPORTANT**: Note the kill switch command: `status-page-maintenance-mode`
- This is needed for Stage 3!
- Click "I Understand • Begin Test"

### 3. Stage 1 - Cognitive Overload (7 seconds)
**Rules:**
- Prime → double it
- Even → halve it
- Ends in 5 → subtract 10

**Question:** Apply to 15, 4, 7

**Solution:**
- 15 ends in 5 → 15 - 10 = **5**
- 4 is even → 4 / 2 = **2**
- 7 is prime → 7 × 2 = **14**

**Answer:** Type `5, 2, 14` or `5214`

### 4. Stage 2 - Race Condition (15 seconds)
**Task:** Click the line number that causes DB lock at T=405ms

**Code on canvas:**
```
1  async function processPayment(orderId) {
2    const order = await db.orders.findById(orderId);
3    const payment = await paymentService.charge(order.amount);
4    await db.inventory.reserve(order.items);  // T=405ms  ← CLICK THIS LINE
5    await db.orders.update(orderId, { status: 'paid' });
6    return payment;
7  }
```

**Answer:** Click on **line 4** (the one with T=405ms comment)

### 5. Stage 3 - Executive Kill (20 seconds)
**Scenario:** Black Friday, payment gateway down, losing $50K/min

**Question:** What is your exact first command or action?

**Answer:** Type `status-page-maintenance-mode` (from the handbook!)

Or variations: "activate status page maintenance mode", "maintenance", etc.

## Anti-Cheat Testing

Try these to trigger failures:

1. **Switch tabs** during test → FOCUS_LOST
2. **Right-click** on code → TAMPERING
3. **Press F12** → TAMPERING
4. **Try Ctrl+C** → TAMPERING
5. **Let timer expire** → TIME_OUT
6. **Wrong answer** → WRONG_ANSWER

## Expected Results

### If You Pass All 3 Stages
- See "PROTOCOL PASSED"
- "You are in the 0.1%"
- Green emerald theme
- Speed: Excellent, Focus: Maintained, Logic: Elite

### If You Fail Any Stage
- See "ACCESS DENIED" (glitchy animation)
- "You are in the 99.9%"
- Red theme with error sound
- 3-metric breakdown showing where you failed
- Sales pitch for Data Buffet Cohort
- "Apply for Batch 12" button

## Audio

- **Start of test**: Low 40Hz hum (subtle tension)
- **On failure**: Harsh 100Hz sawtooth sound

---

## Cheat Sheet (For Testing)

**Stage 1:** `5, 2, 14`
**Stage 2:** Click line 4
**Stage 3:** `status-page-maintenance-mode`

Complete all 3 in time without switching tabs to pass!

---

**Note**: The test is designed for 99.9% to fail. This is intentional. The goal is to create urgency for the cohort program, not to let people pass easily.
