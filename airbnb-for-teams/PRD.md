# Airbnb for Teams — Product Requirements Document

**Author:** Kelby Nardoni  |  **Status:** Draft  |  **Date:** May 2026  |  **Product Area:** Corporate / New Segment Expansion

---

## Problem

### What is the problem?

Small business founders and team leads who want to host meaningful corporate retreats and team events cannot find venues that align with their company's culture, values, and size requirements through existing platforms. A Google search returns generic results with no curation, no headcount filtering, and no understanding of what makes a space right for a specific company's identity.

Our target member is **Matt** — the founder and CEO of The Feed, a nutrition and wellness company with a team of up to 300. The Feed values the outdoors, active experiences, and spaces that reflect their brand ethos. Matt wants to book an annual corporate retreat that feels intentional and on-brand, not generic. Today he has no scalable way to find and book a venue that meets his headcount, geography, budget, and cultural requirements in one place.

**Quantitative sizing:**
- ~6 million small businesses in the US with 10–300 employees — a significant addressable market for corporate event booking
- Corporate retreats and team events represent an estimated **$50B+ annual market**, largely fragmented across hotel groups, event platforms, and manual outreach
- Airbnb already has significant host inventory that could serve corporate groups — the gap is a purpose-built discovery and booking experience, not supply

### How does this connect to company goals and strategy?

Airbnb for Teams directly advances two strategic priorities: **new segment expansion** and **revenue diversification**. Corporate bookings represent a higher average booking value and longer average stay duration than consumer bookings, improving key financial metrics while utilizing existing host inventory.

Strategically, this positions Airbnb as the destination for intentional, values-aligned team experiences — a category no platform currently owns. Companies like The Feed are not looking for a conference room. They are looking for an experience that reflects who they are. Airbnb's inventory of unique, character-rich spaces is a natural fit that no hotel chain or generic event platform can replicate.

### Why is this problem important?

Without this product, Matt continues to spend weeks manually researching venues, making phone calls, and piecing together a retreat that may not reflect The Feed's culture. The friction is so high that many small companies simply don't do retreats — not because they don't want to, but because the process is too painful.

If Airbnb doesn't solve this, a purpose-built corporate retreat platform will — and that represents both a revenue risk and a competitive risk to Airbnb's position as the world's leading experiential accommodation platform.

---

## Goals & Non-Goals

### Goals
- Build a native mobile corporate booking experience that allows small business founders and team leads to discover, filter, and book spaces for team events up to 300 people
- Surface relevant spaces based on company priorities — headcount, duration, geography, budget, and ethos-aligned amenities such as outdoor spaces and wellness facilities
- Drive first corporate booking and establish the foundation for repeat annual bookings
- Generate measurable new revenue from the corporate segment without cannibalizing existing consumer bookings

### Non-Goals (Q1 MVP)
- **Travel coordination** — not booking flights, ground transportation, or managing travel logistics for team members (Q2 consideration)
- **Dining and catering partnerships** — not arranging meals, catering, or F&B experiences as part of the booking flow in MVP
- **AI-powered personalization** — not using machine learning for proactive venue recommendations in Q1; manual filters serve the MVP; personalization for returning users is a Q2 feature built on Q1 booking data
- **Large enterprise** — not building for companies over 300 people; venue availability and coordination complexity make this out of scope for MVP
- **Host-side onboarding** — assuming sufficient existing Airbnb host inventory for Q1; a dedicated corporate host acquisition and onboarding flow is a parallel workstream outside this PRD's scope

---

## Proposal

### Hypothesis

By building a purpose-built corporate team event booking experience within the Airbnb mobile app — with structured intake prompts and filters for headcount, duration, geography, budget, and ethos-aligned amenities — we will drive first corporate bookings from small business founders and establish the repeat booking behavior that defines long-term segment value.

### How does the proposed solution work?

**BEFORE:** Matt wants to plan The Feed's annual team retreat. He opens Google, searches "outdoor retreat venue for 50 people Pacific Northwest," gets a mix of hotel group landing pages, third party aggregators, and irrelevant results. He spends two weeks making phone calls, requesting proposals, and comparing options manually. The process is exhausting and the result rarely feels on-brand. Some years The Feed skips the retreat entirely because it's too hard to plan.

**AFTER:** Matt opens the Airbnb app and selects the new "Teams" experience from the home screen. He is guided through a structured intake — how many people, how many nights, what region, what's your budget, what matters most to your team? He selects outdoor spaces, wellness amenities, and Pacific Northwest. Within seconds he sees a curated list of spaces that match The Feed's profile — a ranch in Oregon with hiking trails, a lakeside lodge in Washington with a yoga deck, a coastal property in Northern California with a farm-to-table kitchen. He shares three options with his team, they vote, he books in under 20 minutes. The Feed's retreat is confirmed.

**Technical architecture:** The product operates on Airbnb's existing search and inventory infrastructure with a new corporate intake layer built on top. The intake prompt captures structured parameters — headcount, duration, geography, budget, amenity preferences — and passes them as filters to the existing search stack. Results are ranked by relevance to the corporate use case: capacity, amenities, and host responsiveness. The booking flow is extended to support corporate confirmation requirements — headcount confirmation, group booking terms, and invoice-ready receipts for business expense reporting.

---

## Metrics

| Metric Category | Metric Name | Metric Definition | Performance Expectation |
|---|---|---|---|
| **Success Metric** | Repeat corporate booking rate | % of companies that complete a first booking and return to book again within 12 months | >30% of first-time corporate bookers return within 12 months |
| Secondary | Corporate booking conversion rate | % of users who start the corporate intake flow and complete a booking | >15% conversion from intake start to booking confirmed |
| Secondary | Average corporate booking value | Average revenue per completed corporate booking | >3x average consumer booking value |
| Secondary | Time to booking | Average time from intake start to booking confirmation | <30 minutes median time to booking |
| Guardrail | Consumer booking impact | Change in consumer booking volume among hosts enrolled in corporate program | Neutral vs. baseline — corporate bookings must not displace consumer demand |
| Guardrail | Host satisfaction score | Host rating of corporate booking experience vs. consumer | Equal to or better than consumer host satisfaction baseline |
| Guardrail | Support contact rate | % of corporate bookings that generate a support contact | <10% support contact rate among corporate bookings |

---

## Scope & Requirements

### Corporate Intake Flow — Mobile UI
- Build a dedicated "Teams" entry point on the Airbnb mobile home screen, distinct from the consumer search experience
- Design a structured intake prompt that captures: headcount (up to 300), duration of stay, preferred geographic region, budget range, and amenity preferences including outdoor spaces, wellness facilities, meeting spaces, and kitchen access
- Intake responses feed directly into the existing search and filter stack as structured parameters
- Results display should surface capacity, key amenities, and host responsiveness prominently for corporate decision makers

### Search & Filtering
- Extend existing search infrastructure to support headcount as a primary filter — spaces must be able to accommodate the full group
- Add ethos-aligned amenity tags: outdoor spaces, hiking access, wellness facilities, yoga spaces, farm or garden access, waterfront
- Geographic filtering at region level — Pacific Northwest, Northeast, Southwest, etc. — in addition to existing city-level search
- Budget filter should surface total booking cost for the group, not per-night per-person rate, to reflect how corporate buyers evaluate cost

### Booking Flow — Corporate Extensions
- Extend booking confirmation to capture group size at time of booking for host awareness
- Surface group booking terms and house rules prominently before confirmation — corporate groups have different behavior expectations than solo travelers
- Generate invoice-ready booking receipts with itemized costs suitable for business expense reporting
- Build group sharing feature — booker can share shortlisted properties with team members for input before confirming

### Host Side — Corporate Readiness Signals
- Add a corporate-readiness flag to host profiles — hosts who opt in signal they can accommodate groups and have reviewed corporate hosting guidelines
- Surface host response rate and response time prominently for corporate results — slow hosts create friction for time-constrained corporate buyers

---

## Alternate Proposals

### Standalone Corporate Booking App
Considered building Airbnb for Teams as a separate standalone app distinct from the consumer Airbnb experience. Ruled out because it creates a separate login, separate inventory, and separate host relationship — adding friction for both bookers and hosts. The power of this product is that it sits on top of Airbnb's existing inventory and trust infrastructure. A standalone app loses that advantage and increases engineering complexity significantly.

### AI-Powered Venue Matching
Considered building an AI recommendation engine that would analyze a company's website, social media, and stated values to proactively match them with aligned venues. Ruled out for MVP because we do not yet have the returning user data or company profile data to make reliable recommendations. Manual filters in Q1 build the data foundation that makes AI matching possible in Q2.

### Full Event Planning Suite
Considered expanding scope to include travel coordination, catering partnerships, team activity booking, and full event management. Ruled out to keep MVP scope tight and deliver faster. The core value proposition is venue discovery and booking — everything else is an enhancement that can be layered on once we have proven the booking experience works.

---

## Plan

### Experiment Overview

| | Control | Treatment 1 | Treatment 2 |
|---|---|---|---|
| **Description** | No corporate booking experience. Small business founders discover and book through the standard consumer search flow with no corporate-specific filtering, headcount support, or intake prompts. | Airbnb for Teams — intake and search only. Users access a dedicated Teams entry point, complete the structured intake, and receive filtered results. No group sharing feature and no invoice receipts. | Airbnb for Teams — full MVP. Same as T1 but adds group sharing feature, invoice-ready receipts, and corporate host readiness signals surfaced in results. |

### Experiment Success Criteria & Decision Guide

| Metric | Outcome | Decision |
|---|---|---|
| Repeat corporate booking rate | Positive vs. control (stat sig) | Confirms core hypothesis. Evaluate T1 vs T2 lift to determine whether group sharing and invoice features add meaningful value. |
| Repeat corporate booking rate | Neutral vs. control (stat sig) | Corporate intake is not driving repeat behavior. Cut data by company size and industry — do certain segments show lift? Iterate on intake design and result relevance before broader rollout. |
| Consumer booking impact (guardrail) | Meaningful negative vs. baseline | Corporate program is displacing consumer demand among enrolled hosts. Pause broader rollout. Review host enrollment criteria and capacity requirements before relaunch. |
| Support contact rate (guardrail) | Exceeds 10% threshold | Corporate bookers are confused or encountering friction. Review intake flow, group booking terms, and host communication for clarity gaps. Do not proceed to full rollout until support rate returns to baseline. |
