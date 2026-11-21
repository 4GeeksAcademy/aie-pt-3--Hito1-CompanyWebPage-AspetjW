# HealthCore - Milestone 2: TypeScript Data Processing Utilities

## 📋 Project Overview

This milestone focuses on creating robust, type-safe TypeScript utilities for processing and analyzing healthcare data at HealthCore. The utilities will support:

1. **AI-Assisted Claim Review System** - Automated processing of insurance claims with risk flagging
2. **Clinical Documentation Processing** - NLP-ready data structures for medical records
3. **Patient No-Show Prediction** - Analytics on appointment attendance patterns

---

## 🏥 Core Entities & Data Models

### 1. **Claim** (Insurance Claim Record)
Represents a submitted insurance claim with status tracking and financial data.

```typescript
interface Claim {
  id: string;                    // Unique identifier (UUID format)
  claimNumber: string;           // Human-readable claim reference
  patientId: string;             // Reference to patient
  providerId: string;            // Reference to healthcare provider
  submissionDate: Date;          // When claim was submitted
  claimAmount: number;           // Total claim amount in USD (> 0)
  denialAmount: number;          // Denied/rejected amount (>= 0)
  approvedAmount: number;        // Approved/paid amount (>= 0)
  status: ClaimStatus;           // Current processing status
  denialReasons: string[];       // Array of reason codes for denials
  serviceDate: Date;             // When service was provided
  lastUpdatedDate: Date;         // Last modification timestamp
  region: "US" | "UK";           // Geographic region
  priority: "LOW" | "MEDIUM" | "HIGH"; // Risk/priority level
  requiresAIReview: boolean;     // Flag for AI-assisted review
  notes: string;                 // Clinical or administrative notes
}

type ClaimStatus = "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "PARTIALLY_APPROVED" | "DENIED" | "APPEALED";
```

### 2. **Patient**
Demographic and appointment data for patients.

```typescript
interface Patient {
  id: string;                    // Unique identifier (UUID)
  firstName: string;             // First name (non-empty)
  lastName: string;              // Last name (non-empty)
  dateOfBirth: Date;             // Birth date (must be in past)
  email: string;                 // Email address (valid format)
  phoneNumber: string;           // Phone number (10+ digits)
  registrationDate: Date;        // When patient registered
  appointmentCount: number;      // Total scheduled appointments (>= 0)
  noShowCount: number;           // Total no-shows (>= 0)
  lastVisitDate: Date | null;    // Last appointment attended (null if none)
  riskScore: number;             // No-show prediction score (0-100)
  region: "US" | "UK";           // Primary region
}
```

### 3. **Provider**
Healthcare provider/facility information.

```typescript
interface Provider {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Provider name (non-empty)
  providerType: ProviderType;    // Type of provider
  npi: string;                   // National Provider Identifier (10+ characters)
  claimsSubmitted: number;       // Total claims filed (>= 0)
  denialRate: number;            // Historical denial percentage (0-100)
  region: "US" | "UK";           // Primary operating region
  avgClaimAmount: number;        // Average claim value (>= 0)
  specialties: string[];         // Medical specialties
}

type ProviderType = "HOSPITAL" | "CLINIC" | "LABORATORY" | "IMAGING_CENTER" | "SPECIALIST";
```

### 4. **ClinicalNote**
Unstructured/semi-structured clinical documentation.

```typescript
interface ClinicalNote {
  id: string;                    // Unique identifier
  patientId: string;             // Associated patient
  providerId: string;            // Authoring provider
  createdDate: Date;             // Note creation timestamp
  documentType: DocumentType;    // Type of clinical document
  content: string;               // Raw clinical text (non-empty)
  wordCount: number;             // Length in words (> 0)
  keywords: string[];            // Extracted medical terms
  aiProcessed: boolean;          // Whether NLP has processed it
  confidenceScore: number;       // AI processing confidence (0-100, or -1 if not processed)
}

type DocumentType = "PROGRESS_NOTE" | "DISCHARGE_SUMMARY" | "LAB_RESULT" | "IMAGING_REPORT" | "PRESCRIPTION";
```

### 5. **Appointment**
Patient appointment records for no-show analysis.

```typescript
interface Appointment {
  id: string;                    // Unique identifier
  patientId: string;             // Associated patient
  providerId: string;            // Provider conducting appointment
  scheduledDate: Date;           // Scheduled appointment time
  attendanceStatus: AttendanceStatus; // Whether patient showed up
  appointmentType: string;       // Type (e.g., "FOLLOW_UP", "CHECKUP")
  remindersSent: number;         // Count of sent reminders (>= 0)
  region: "US" | "UK";           // Geographic region
  durationMinutes: number;       // Planned duration (> 0)
}

type AttendanceStatus = "SCHEDULED" | "ATTENDED" | "NO_SHOW" | "CANCELLED" | "RESCHEDULED";
```

---

## 🔍 Filtering & Search Criteria

### ClaimFilter
```typescript
interface ClaimFilter {
  status?: ClaimStatus[];
  minAmount?: number;            // Minimum claim amount
  maxAmount?: number;            // Maximum claim amount
  region?: "US" | "UK";
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  denialReasonsInclude?: string[];
  requiresAIReview?: boolean;
  priority?: ("LOW" | "MEDIUM" | "HIGH")[];
}
```

### PatientFilter
```typescript
interface PatientFilter {
  region?: "US" | "UK";
  minNoShowCount?: number;
  maxNoShowCount?: number;
  riskScoreMin?: number;         // 0-100
  riskScoreMax?: number;         // 0-100
  registeredAfter?: Date;
  registeredBefore?: Date;
}
```

### AppointmentFilter
```typescript
interface AppointmentFilter {
  attendanceStatus?: AttendanceStatus[];
  region?: "US" | "UK";
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  minReminders?: number;
}
```

---

## 📊 Sorting Options

### SortOrder
```typescript
type SortOrder = "ASC" | "DESC";

interface SortOptions<T> {
  field: keyof T;
  order: SortOrder;
}
```

---

## 📈 Reports & Aggregations Required

### 1. Claim Statistics Report
```typescript
interface ClaimStatisticsReport {
  totalClaims: number;
  totalSubmittedAmount: number;
  totalApprovedAmount: number;
  totalDeniedAmount: number;
  denialRate: number;            // Percentage (0-100)
  avgClaimAmount: number;
  medianClaimAmount: number;
  claimsByStatus: Record<ClaimStatus, number>;
  claimsByRegion: Record<"US" | "UK", number>;
  claimsByPriority: Record<"LOW" | "MEDIUM" | "HIGH", number>;
  topDenialReasons: Array<{ reason: string; count: number }>;
}
```

### 2. Patient Analytics Report
```typescript
interface PatientAnalyticsReport {
  totalPatients: number;
  avgNoShowRate: number;         // Percentage
  patientsWithHighRisk: number;  // Count with riskScore > 70
  patientsWithNoShows: number;   // Count where noShowCount > 0
  avgAppointmentCount: number;
  noShowsByRegion: Record<"US" | "UK", number>;
  riskScoreDistribution: {
    lowRisk: number;             // 0-30
    mediumRisk: number;          // 31-70
    highRisk: number;            // 71-100
  };
}
```

### 3. Provider Performance Report
```typescript
interface ProviderPerformanceReport {
  totalProviders: number;
  avgDenialRate: number;         // Percentage
  avgClaimAmount: number;
  providersByType: Record<ProviderType, number>;
  topProvidersByClaimVolume: Array<{
    id: string;
    name: string;
    claimsSubmitted: number;
  }>;
  providersByRegion: Record<"US" | "UK", number>;
}
```

### 4. No-Show Prediction Report
```typescript
interface NoShowPredictionReport {
  totalAppointments: number;
  attendanceRate: number;        // Percentage
  noShowRate: number;            // Percentage
  noShowsByRegion: Record<"US" | "UK", number>;
  noShowsByDayOfWeek: Record<string, number>;
  avgRemindersForAttendees: number;
  avgRemindersForNoShows: number;
  patientsAtHighRisk: number;    // riskScore > 70
}
```

---

## ✅ Business Rules & Validations

### Claim Validation Rules
1. **Amount Consistency:** `approvedAmount + denialAmount ≤ claimAmount` (with 0.01 tolerance for rounding)
2. **Date Logic:** `serviceDate ≤ submissionDate ≤ lastUpdatedDate`
3. **Status Coherence:** 
   - If status = "DENIED", then `approvedAmount = 0`
   - If status = "APPROVED", then `denialAmount = 0`
   - If status = "PARTIALLY_APPROVED", then both amounts > 0
4. **Mandatory Fields:** claimNumber, patientId, providerId must be non-empty strings
5. **Amount Ranges:** claimAmount, approvedAmount, denialAmount ≥ 0
6. **Denial Reasons:** Cannot contain duplicates or empty strings

### Patient Validation Rules
1. **Age Constraint:** Patient must be at least 18 years old
2. **Email Format:** Must match valid email regex pattern
3. **Phone Validation:** Must be numeric, 10+ digits
4. **Consistency Check:** `lastVisitDate ≤ currentDate` (if present)
5. **No-Show Logic:** `noShowCount ≤ appointmentCount`
6. **Risk Score Range:** 0 ≤ riskScore ≤ 100
7. **Mandatory Fields:** firstName, lastName, email must be non-empty

### Provider Validation Rules
1. **NPI Format:** Exactly 10 characters, numeric
2. **Denial Rate:** 0 ≤ denialRate ≤ 100
3. **Positive Values:** claimsSubmitted, avgClaimAmount ≥ 0
4. **Non-empty Collections:** name, npi must not be empty

### ClinicalNote Validation Rules
1. **Content Required:** Non-empty, minimum 10 characters
2. **Word Count:** Must match actual word count (> 0)
3. **Confidence Score:** -1 (not processed) or 0-100
4. **Date Logic:** `createdDate ≤ currentDate`
5. **Keywords Validation:** No duplicates, no empty strings

### Appointment Validation Rules
1. **Scheduling Logic:** `scheduledDate ≥ currentDate`
2. **Duration:** durationMinutes > 0
3. **Reminders Count:** ≥ 0
4. **Status Coherence:**
   - If attendanceStatus = "ATTENDED", then valid past appointment
   - If attendanceStatus = "NO_SHOW", then valid past appointment
   - If attendanceStatus = "SCHEDULED", then future appointment

---

## 🎯 Key Utility Functions Overview

### Search Utilities (`src/utils/search.ts`)
- `linearSearch<T>(array, predicate)` - Find in unsorted array
- `binarySearch<T>(array, value, compareFn)` - Find in sorted array
- Proper null/empty handling

### Collection Utilities (`src/utils/collections.ts`)
- `filterByMultipleCriteria<T>(items, filters)` - Multi-criteria filtering
- `sortAscending<T>(items, field)` - Sort ascending
- `sortDescending<T>(items, field)` - Sort descending
- `groupBy<T>(items, key)` - Group by field value
- `distinct<T>(items, key?)` - Remove duplicates

### Transformation Utilities (`src/utils/transformations.ts`)
- `countByProperty<T>(items, property)` - Group and count
- `sumByProperty<T>(items, property)` - Calculate sum
- `averageByProperty<T>(items, property)` - Calculate average
- `maxByProperty<T>(items, property)` - Find maximum value
- `minByProperty<T>(items, property)` - Find minimum value
- `generateClaimStatisticsReport(claims)` - Full report aggregation
- `generatePatientAnalyticsReport(patients)` - Patient analytics
- `generateProviderPerformanceReport(providers)` - Provider metrics
- `generateNoShowPredictionReport(appointments)` - Attendance analysis

### Validation Utilities (`src/utils/validations.ts`)
- `validateClaim(claim)` - Full claim validation
- `validatePatient(patient)` - Full patient validation
- `validateProvider(provider)` - Full provider validation
- `validateClinicalNote(note)` - Full clinical note validation
- `validateAppointment(appointment)` - Full appointment validation
- Each validator returns `{ isValid: boolean; errors: string[] }`

---

## 🚀 TypeScript Requirements

- **No `any` types** - Explicit typing everywhere
- **Pure functions** - No side effects
- **Immutability** - Original arrays/objects unchanged
- **Single Responsibility Principle** - Each function does one thing
- **Explicit return types** - All functions typed
- **Generic types where applicable** - Reusable utilities
- **Naming Conventions:**
  - Functions/variables: `camelCase`
  - Interfaces/Types: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`

---

## 📂 Directory Structure

```
src/
├── types/
│   └── models.ts              # All interfaces and types
├── utils/
│   ├── search.ts              # Linear & binary search
│   ├── collections.ts         # Filter, sort, group, distinct
│   ├── transformations.ts     # Aggregation and report generation
│   └── validations.ts         # Validation functions
└── index.ts                   # Barrel exports
```

---

## ✨ Acceptance Criteria

✅ All TypeScript files compile without errors  
✅ Zero use of `any` type  
✅ All functions are pure and immutable  
✅ All validations implement business rules correctly  
✅ Reports aggregate data accurately  
✅ Code follows naming conventions  
✅ Each file has single responsibility  
✅ Comprehensive type safety throughout  

---

## 📝 Notes

- All dates should be handled as `Date` objects internally
- Financial amounts are in USD (whole cents acceptable)
- Percentage values are 0-100 (not 0-1)
- All collections are arrays (not Maps/Sets in public API)
- All functions should handle empty arrays gracefully
