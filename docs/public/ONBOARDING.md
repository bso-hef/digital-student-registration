# Student Onboarding Process

Complete documentation of the 10-step student onboarding flow.

## Table of Contents

- [Overview](#overview)
- [Onboarding Flow](#onboarding-flow)
- [Step Details](#step-details)
- [Form Validation](#form-validation)
- [Data Flow](#data-flow)
- [Navigation](#navigation)

---

## Overview

The student onboarding process is a **10-step wizard** that collects comprehensive student information. Each step focuses on a specific aspect of the student's profile.

### Key Features

- **Multi-step wizard** with progress indicator
- **Form validation** using Formik + Yup
- **Auto-save** to Redux state on each step
- **Step navigation** with back/next buttons
- **Summary review** before final submission
- **Mobile-responsive** design

### User Flow

```
URL: /student/[studentId]

Step 0: Welcome
  ↓
Step 1: General Information
  ↓
Step 2: Origin/Nationality
  ↓
Step 3: Address
  ↓
Step 4: Parents/Guardians
  ↓
Step 5: Previous Education
  ↓
Step 6: Training Program
  ↓
Step 7: Company Contact (conditional)
  ↓
Step 8: Summary Review
  ↓
Step 9: Completion
```

---

## Onboarding Flow

### Access Point

Students access onboarding via unique URL:

```
https://app.example.com/student/[unique-student-id]
```

The `studentId` is generated when the student record is created.

### Step Navigation

Located in: `src/constants/studentSteps.constants.tsx`

```typescript
export const getStudentSteps = (t: TFunction): StepDef[] => [
  { id: 0, label: t("student.steps.Welcome"), icon: <HomeRoundedIcon /> },
  { id: 1, label: t("student.steps.General"), icon: <InfoRoundedIcon /> },
  { id: 2, label: t("student.steps.Origin"), icon: <PublicRoundedIcon /> },
  { id: 3, label: t("student.steps.Address"), icon: <LocationOnRoundedIcon /> },
  { id: 4, label: t("student.steps.Parents"), icon: <FamilyRestroomRoundedIcon /> },
  { id: 5, label: t("student.steps.Pre Education"), icon: <SchoolRoundedIcon /> },
  { id: 6, label: t("student.steps.Training"), icon: <WorkRoundedIcon /> },
  { id: 7, label: t("student.steps.Company Contact"), icon: <BusinessRoundedIcon /> },
  { id: 8, label: t("student.steps.Summary"), icon: <SummarizeRoundedIcon /> },
  { id: 9, label: t("student.steps.Completion"), icon: <EmojiEventsRoundedIcon /> },
];
```

### Current Step Tracking

Stored in Redux:

```typescript
// Redux state
student: {
  currentStep: number,       // 0-9
  data: StudentFormData      // All form data
}
```

---

## Step Details

### Step 0: Welcome

**Component:** `src/components/organisms/forms/WelcomeForm/index.tsx`

**Purpose:** Introduction and onboarding overview

**Fields:** None (information only)

**Actions:**

- "Start" button → Navigate to Step 1

**Content:**

- Welcome message
- Overview of onboarding process
- Estimated time to complete
- Privacy information

---

### Step 1: General Information

**Component:** `src/components/organisms/forms/GeneralForm/index.tsx`

**Purpose:** Collect basic student information

**Fields:**

- First Name (required)
- Last Name (required)
- Date of Birth (required)
- Gender (required)
- Email (optional)
- Phone (optional)

**Validation:**

```typescript
{
  firstName: Yup.string().required("First name is required").min(2),
  lastName: Yup.string().required("Last name is required").min(2),
  dateOfBirth: Yup.date().required("Date of birth is required").max(new Date()),
  gender: Yup.string().required("Gender is required").oneOf(["male", "female", "other"]),
  email: Yup.string().email("Invalid email format").nullable(),
  phone: Yup.string().min(10).nullable()
}
```

---

### Step 2: Origin/Nationality

**Component:** `src/components/organisms/forms/OriginForm/index.tsx`

**Purpose:** Collect nationality and birthplace information

**Fields:**

- Country of Birth (required)
- City of Birth (required)
- Nationality (required)
- Second Nationality (optional)
- Native Language (required)
- Additional Languages (optional)

**Validation:**

```typescript
{
  countryOfBirth: Yup.string().required("Country of birth is required"),
  cityOfBirth: Yup.string().required("City of birth is required"),
  nationality: Yup.string().required("Nationality is required"),
  secondNationality: Yup.string().nullable(),
  nativeLanguage: Yup.string().required("Native language is required"),
  additionalLanguages: Yup.array().of(Yup.string())
}
```

---

### Step 3: Address

**Component:** `src/components/organisms/forms/AddressForm/index.tsx`

**Purpose:** Collect current residential address

**Fields:**

- Street Address (required)
- City (required)
- State/Province (optional)
- Postal Code (required)
- Country (required)

**Validation:**

```typescript
{
  street: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().nullable(),
  zip: Yup.string().required("Postal code is required").min(5),
  country: Yup.string().required("Country is required")
}
```

**Auto-Detection:**

- Timezone automatically detected from country code
- Uses `countries-and-timezones` package

---

### Step 4: Parents/Guardians

**Component:** `src/components/organisms/forms/ParentsForm/index.tsx`

**Purpose:** Collect parent/guardian contact information

**Fields:**

- Parent 1:
  - Name (required)
  - Relationship (required)
  - Phone (required)
  - Email (optional)
- Parent 2:
  - Name (optional)
  - Relationship (optional)
  - Phone (optional)
  - Email (optional)

**Validation:**

```typescript
{
  parent1: Yup.object({
    name: Yup.string().required("Parent 1 name is required"),
    relationship: Yup.string().required("Relationship is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email().nullable()
  }),
  parent2: Yup.object({
    name: Yup.string().nullable(),
    relationship: Yup.string().nullable(),
    phone: Yup.string().nullable(),
    email: Yup.string().email().nullable()
  })
}
```

---

### Step 5: Previous Education

**Component:** `src/components/organisms/forms/PreEducationForm/index.tsx`

**Purpose:** Collect previous school information

**Fields:**

- Last School Name (required)
- School Type (required)
- Graduation Year (required)
- Final Grade/GPA (optional)
- Degree/Certificate (optional)

**Validation:**

```typescript
{
  lastSchoolName: Yup.string().required("Last school name is required"),
  schoolType: Yup.string().required("School type is required"),
  graduationYear: Yup.number().required("Graduation year is required").min(1950).max(new Date().getFullYear()),
  finalGrade: Yup.string().nullable(),
  degree: Yup.string().nullable()
}
```

---

### Step 6: Training Program

**Component:** `src/components/organisms/forms/TrainingForm/index.tsx`

**Purpose:** Select training program or class

**Fields:**

- Program Type (required)
- Vocational Training (checkbox)
- Start Date (required)
- Expected End Date (optional)

**Validation:**

```typescript
{
  programType: Yup.string().required("Program type is required"),
  isVocational: Yup.boolean(),
  startDate: Yup.date().required("Start date is required"),
  expectedEndDate: Yup.date().nullable().min(Yup.ref("startDate"))
}
```

**Conditional Logic:**

- If `isVocational` is checked → Show Step 7 (Company Contact)
- If `isVocational` is unchecked → Skip Step 7

---

### Step 7: Company Contact (Conditional)

**Component:** `src/components/organisms/forms/CompanyContactForm/index.tsx`

**Purpose:** Collect employer information for vocational students

**Visibility:** Only shown if Step 6 indicates vocational training

**Fields:**

- Company Name (required)
- Company Address (required)
- Contact Person Name (required)
- Contact Email (required)
- Contact Phone (optional)

**Validation:**

```typescript
{
  companyName: Yup.string().required("Company name is required"),
  companyAddress: Yup.string().required("Company address is required"),
  contactName: Yup.string().required("Contact person name is required"),
  contactEmail: Yup.string().email("Invalid email").required("Contact email is required"),
  contactPhone: Yup.string().nullable()
}
```

---

### Step 8: Summary Review

**Component:** `src/components/organisms/forms/SummaryForm/index.tsx`

**Purpose:** Review all entered information before submission

**Display:**

- Read-only view of all collected data
- Grouped by section (General, Address, Parents, etc.)
- "Edit" buttons to return to specific steps

**Actions:**

- "Edit Step X" → Navigate back to that step
- "Submit" → Final submission

**Validation:**

- Comprehensive validation of all previous steps
- Ensures no required fields are missing

---

### Step 9: Completion

**Component:** `src/components/organisms/forms/FormCompletion/index.tsx`

**Purpose:** Confirmation and next steps

**Display:**

- Success message
- Confirmation number
- Next steps information
- Download/print option for summary

**Actions:**

- "Download Summary" → PDF generation
- "Close" → Exit onboarding

---

## Form Validation

### Validation Library

Uses **Yup** for schema validation:

```typescript
// src/lib/validate/student.validate.ts
import * as Yup from "yup";

export const validateGeneralStudentData = Yup.object({
  firstName: Yup.string().required("First name is required").min(2),
  lastName: Yup.string().required("Last name is required").min(2),
  dateOfBirth: Yup.date().required().max(new Date()),
  // ... more fields
});
```

### Real-Time Validation

Formik provides real-time validation:

```typescript
<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  validateOnChange={true}
  validateOnBlur={true}
  onSubmit={handleSubmit}
>
  {/* Form fields */}
</Formik>
```

### Error Display

Errors shown below each field:

```typescript
import { TextField } from "formik-mui";

<Field
  component={TextField}
  name="firstName"
  label="First Name"
  fullWidth
  required
/>
// Formik automatically shows validation errors
```

---

## Data Flow

### 1. Initial State

When student accesses onboarding URL:

```typescript
// Redux initial state
student: {
  currentStep: 0,
  data: {},
  loading: false,
  error: null
}
```

### 2. Step Progression

On each "Next" button click:

```typescript
// 1. Validate current step
const isValid = await formik.validateForm();

if (isValid) {
  // 2. Save data to Redux
  dispatch(updateStudentData(formData));

  // 3. Increment step
  dispatch(setCurrentStep(currentStep + 1));
}
```

### 3. Final Submission

On Step 8 "Submit":

```typescript
// 1. Compile all data from Redux
const studentData = {
  ...student.data,
  status: "onboarded",
};

// 2. Send to API
await studentService.update(studentId, studentData);

// 3. Navigate to completion
dispatch(setCurrentStep(9));
```

### Data Persistence

- **Redux State**: All form data stored in Redux
- **Redux Persist**: State persisted to localStorage
- **Auto-Save**: Each step saves to Redux
- **Final Submit**: Data sent to MongoDB via API

---

## Navigation

### Navigation Controls

Located in: `src/components/organisms/StepForm/index.tsx`

```typescript
<Box display="flex" justifyContent="space-between">
  {/* Back Button */}
  {currentStep > 0 && (
    <GeneralButton
      label="Back"
      onAction={() => dispatch(setCurrentStep(currentStep - 1))}
    />
  )}

  {/* Next/Submit Button */}
  <GeneralButton
    label={currentStep === 8 ? "Submit" : "Next"}
    onAction={formik.handleSubmit}
    disabled={!formik.isValid}
  />
</Box>
```

### Progress Indicator

Shows current step and progress:

```typescript
// src/app/(home)/student/DynamicPageStepper.tsx
<Stepper activeStep={currentStep} alternativeLabel>
  {steps.map((step) => (
    <Step key={step.id}>
      <StepLabel icon={step.icon}>
        {step.label}
      </StepLabel>
    </Step>
  ))}
</Stepper>
```

### Step Skipping

- Steps can be skipped by clicking on completed steps in the stepper
- Conditional steps (Step 7) are automatically skipped if not applicable

---

## Accessibility

### Keyboard Navigation

- Tab through form fields
- Enter to submit
- Escape to cancel modals

### Screen Reader Support

- Proper ARIA labels
- Form field descriptions
- Error announcements

### Visual Indicators

- Required field markers (\*)
- Error states with red borders
- Success states with green checkmarks

---

## Mobile Optimization

### Responsive Design

- Stepper switches to vertical on mobile
- Form fields stack vertically
- Touch-friendly buttons and inputs
- Adaptive font sizes

### Mobile-Specific Features

- Date pickers use native controls
- Dropdown selects optimized for touch
- Back button always accessible

---

## Testing

### Unit Tests

Located in: `tests/unit/components/organisms/forms/`

Test each form component:

- Renders correctly
- Validates fields
- Handles submission
- Shows errors

### E2E Tests

Located in: `tests/e2e/student/onboarding/onboarding.spec.ts`

Test complete flow:

- Navigate through all steps
- Fill out all required fields
- Submit successfully
- Verify data saved to database

---

## Future Enhancements

- **Save & Resume Later** - Allow partial completion
- **File Uploads** - For documents (birth certificate, transcripts)
- **Multi-Language** - Already has i18n, add more languages
- **Email Notifications** - Confirmation emails at each stage
- **SMS Verification** - Verify phone numbers
- **Digital Signature** - For consent forms
