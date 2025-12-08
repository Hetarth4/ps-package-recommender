# ThoughtSpot Professional Services Package Recommender
## Complete Technical Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & File Structure](#architecture--file-structure)
3. [Component Breakdown](#component-breakdown)
4. [Data Flow & Logic](#data-flow--logic)
5. [Scoring System](#scoring-system)
6. [Styling & Design](#styling--design)
7. [Deployment Guide](#deployment-guide)

---

## 1. Project Overview

### Purpose
This application is a web-based tool designed to help ThoughtSpot's Professional Services team recommend the optimal service package (Starter, Advanced, or Premium) for customers based on their project requirements.

### Technology Stack
- **Framework:** Next.js 14.2.33 (React-based)
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Deployment:** Vercel
- **Node Version:** 18.x or higher

### Package Types
The recommender suggests one of six packages:
1. **Jumpstart AI Starter** - Simple, new implementations
2. **Jumpstart AI Advanced** - Medium complexity new implementations
3. **Jumpstart AI Premium** - Complex new implementations
4. **Modernization Starter** - Simple migration projects
5. **Modernization Advanced** - Medium complexity migrations
6. **Modernization Premium** - Complex migration projects

---

## 2. Architecture & File Structure

### Project Structure
```
PS Package - Cursor/
├── app/
│   ├── page.tsx                 # Main entry point (renders PSPackageRecommender)
│   ├── layout.tsx              # Root layout with metadata
│   ├── globals.css             # Global styles and CSS variables
│   └── favicon.ico             # Site favicon
├── components/
│   ├── PSPackageRecommender.tsx          # Main form component
│   ├── PSPackageRecommender.module.css   # Component-specific styles
│   ├── Tooltip.tsx                       # Info tooltip component
│   ├── Tooltip.module.css                # Tooltip styles
│   ├── Header.tsx                        # Page header with logo
│   └── Header.module.css                 # Header styles
├── public/
│   └── thoughtspot-logo.png    # ThoughtSpot branding logo
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

### Key Files and Their Roles

#### **app/page.tsx**
- Entry point of the application
- Imports and renders the PSPackageRecommender component
- Minimal code - just the component wrapper

#### **app/globals.css**
- Defines CSS custom properties (variables) for consistent theming
- Sets up dark mode color palette
- Defines background gradients and animations
- CSS Variables include:
  - `--ts-primary`: Main brand color (cyan: #00D4DD)
  - `--ts-background`: Page background
  - `--ts-surface`: Card/container backgrounds
  - `--ts-text-primary/secondary/tertiary`: Text colors

#### **components/PSPackageRecommender.tsx** (Main Logic Hub)
- **Size:** ~600 lines
- **Purpose:** Core business logic and form handling
- **Key Responsibilities:**
  1. Form state management
  2. User input collection
  3. Score calculation
  4. Package recommendation logic
  5. Reasoning generation
  6. ACV validation

#### **components/PSPackageRecommender.module.css**
- **Size:** ~580 lines
- **Purpose:** All styling for the main component
- Includes styles for:
  - Form layout and grid
  - Dropdown fields
  - Buttons and inputs
  - Results display
  - Responsive breakpoints

#### **components/Tooltip.tsx**
- **Purpose:** Info icon with hover tooltip
- Shows detailed explanations for each form field
- Positioned dynamically to stay in viewport

#### **components/Header.tsx**
- **Purpose:** Page header with branding
- Displays ThoughtSpot logo
- Shows page title
- Centered layout

---

## 3. Component Breakdown

### A. PSPackageRecommender Component

#### State Management
```typescript
interface FormData {
  teamSize: string              // Expected users at go-live
  primaryNeed: string           // POC vs Production-ready
  dataComplexity: string        // Single vs Multi-source
  businessLogic: string         // Standard vs Advanced
  securityReq: string           // Basic vs Advanced RLS
  useCases: string              // Single vs Multiple
  goLive: string                // Guided vs Hands-on support
  tsaTse: string                // TSA vs TSE deployment
  tseType: string               // Out of Box vs Custom Actions
  isMigration: boolean          // Migration vs New implementation
}
```

**Three Main State Variables:**
1. `formData` - Stores all user selections
2. `recommendation` - Stores calculated package, score, price, reasoning
3. `acv` - Stores Annual Contract Value for validation
4. `acvValidation` - Stores validation result

#### Dropdown Options with Scoring Weights

**1. Team Size**
- `<10 users` → 1 point
- `10–50 users` → 2 points
- `50–100 users` → 3 points
- `Hundreds of users (enterprise-wide)` → 4 points

**2. Primary Need**
- `Proof of Concept` → 1 point
- `Production-ready polished use case` → 2 points

**3. Data Complexity**
- `Single data source (simple schema)` → 1 point
- `Multiple data sources (moderate complexity)` → 2 points
- `Complex multi-source integration (advanced)` → 3 points

**4. Business Logic**
- `Standard aggregations` → 1 point
- `Advanced formulas, custom calendars` → 3 points

**5. Security Requirements**
- `Basic group RLS` → 1 point
- `Advanced user-level, compliance-heavy` → 3 points

**6. Number of Use Cases**
- `1` → 1 point
- `>1 (Multiple)` → 3 points

**7. Go-Live Support**
- `Guided/advisory` → 1 point
- `Hands on support/co-build` → 3 points

**8. TSE Type (Conditional)**
- If TSE with `Custom Actions` → +1 bonus point

#### Key Functions

**`handleSubmit(e: React.FormEvent)`**
- Triggered when user clicks "Get Recommendation"
- Validates all fields are filled
- Calculates total score from all selections
- Determines package level based on score thresholds
- Generates reasoning
- Updates recommendation state

**Score Calculation Logic:**
```javascript
totalScore = 
  teamSizeScore +
  primaryNeedScore +
  dataComplexityScore +
  businessLogicScore +
  securityReqScore +
  useCasesScore +
  goLiveScore +
  (TSE Custom Actions bonus)
```

**Package Level Determination:**
```javascript
if (totalScore <= 10) → Starter
if (totalScore <= 18) → Advanced  
if (totalScore > 18)  → Premium
```

**Package Type Determination:**
```javascript
if (isMigration === true) → "Modernization"
if (isMigration === false) → "Jumpstart AI"
```

**`generateReasoning()`**
- Creates structured reasoning with 3 sections:
  1. **Your Project at a Glance** - Summary of selections
  2. **Why This Package is the Right Fit** - Alignment explanation
  3. **What You'll Get with This Package** - Feature breakdown
- Returns array of strings with markdown formatting
- Tailored content based on package level and selections

**`handleAcvValidation()`**
- Validates entered ACV against package recommendation
- ACV Rules:
  - `< $100K` → Starter or Advanced allowed
  - `$100K - $150K` → Advanced only
  - `> $150K` → Premium only
- Displays success or warning message

#### Pricing Structure
```javascript
const prices = {
  'Modernization': { 
    Starter: $20,000, 
    Advanced: $50,000, 
    Premium: $80,000 
  },
  'Jumpstart AI': { 
    Starter: $5,000, 
    Advanced: $20,000, 
    Premium: $60,000 
  }
}
```

---

### B. Tooltip Component

**Purpose:** Provides contextual help for each form field

**Props:**
- `content: string` - The tooltip text to display
- `children: React.ReactNode` - The element to attach tooltip to (label + icon)

**Behavior:**
- Shows on hover over info icon (ⓘ)
- Positioned above the icon
- Dark background with cyan border
- Auto-hides when mouse leaves

**Implementation:**
```typescript
const [isVisible, setIsVisible] = useState(false)

onMouseEnter → setIsVisible(true)
onMouseLeave → setIsVisible(false)
```

---

### C. Header Component

**Purpose:** Displays branding and page title

**Structure:**
- ThoughtSpot logo (500x126px)
- Centered layout
- Title: "Professional Services Package Recommender"

**Styling:**
- Glass morphism effect
- Sticky positioning (stays at top when scrolling)
- Gradient background with blur

---

## 4. Data Flow & Logic

### Complete User Journey

```
1. USER LANDS ON PAGE
   ↓
   app/page.tsx loads
   ↓
   Renders <PSPackageRecommender />
   ↓
   Component initializes with default state

2. USER FILLS FORM
   ↓
   Each dropdown onChange updates formData state
   ↓
   Tooltip shows on hover for field help
   ↓
   Migration checkbox toggle updates isMigration
   ↓
   TSE selection conditionally shows TSE Type field

3. USER CLICKS "GET RECOMMENDATION"
   ↓
   handleSubmit() triggered
   ↓
   Validation: Check all required fields filled
   ↓
   Calculate totalScore from all selections
   ↓
   Determine packageLevel (Starter/Advanced/Premium)
   ↓
   Determine packageType (Jumpstart AI vs Modernization)
   ↓
   Look up price from pricing matrix
   ↓
   Generate reasoning array
   ↓
   Update recommendation state with:
     - package name
     - score
     - price
     - reasoning array

4. RESULTS DISPLAY
   ↓
   Recommendation card shows:
     - Package name
     - Total score
     - Approximate price
   ↓
   Reasoning section displays:
     - Project summary
     - Why this package fits
     - What you'll get
   ↓
   Link to Google Slides presentation
   ↓
   ACV Validation section appears

5. USER VALIDATES ACV (OPTIONAL)
   ↓
   User enters ACV dollar amount
   ↓
   Clicks "Validate with ACV"
   ↓
   handleAcvValidation() triggered
   ↓
   Converts ACV to number
   ↓
   Checks ACV range rules
   ↓
   Compares with recommended package level
   ↓
   Displays validation message:
     - SUCCESS: Package aligns with ACV
     - WARNING: Suggests different package + PS team contact
```

---

## 5. Scoring System

### Current Scoring Model (Updated)

**Total Possible Score Range:** 7 - 23 points

**Breakdown by Category:**
- Team Size: 1-4 points (max 4)
- Primary Need: 1-2 points (max 2)
- Data Complexity: 1-3 points (max 3)
- Business Logic: 1-3 points (max 3)
- Security Requirements: 1-3 points (max 3)
- Use Cases: 1-3 points (max 3)
- Go-Live Support: 1-3 points (max 3)
- TSE Custom Actions: 0-1 bonus (max 1)

**Package Thresholds:**
```
Score ≤ 10  → Starter Package
Score 11-18 → Advanced Package
Score > 18  → Premium Package
```

### Example Scoring Scenarios

**Scenario 1: Simple New Deployment**
- Team: <10 users (1)
- Need: POC (1)
- Data: Single source (1)
- Logic: Standard (1)
- Security: Basic RLS (1)
- Use Cases: 1 (1)
- Support: Guided (1)
- **Total: 7 points → Jumpstart AI Starter ($5,000)**

**Scenario 2: Medium Complexity Migration**
- Team: 50-100 users (3)
- Need: Production-ready (2)
- Data: Multiple sources (2)
- Logic: Advanced (3)
- Security: Advanced (3)
- Use Cases: Multiple (3)
- Support: Hands-on (3)
- Migration: Yes
- **Total: 19 points → Modernization Premium ($80,000)**

**Scenario 3: Enterprise TSE Deployment**
- Team: Hundreds (4)
- Need: Production-ready (2)
- Data: Complex integration (3)
- Logic: Advanced (3)
- Security: Advanced (3)
- Use Cases: Multiple (3)
- Support: Hands-on (3)
- TSE: Custom Actions (+1 bonus)
- **Total: 22 points → Jumpstart AI Premium ($60,000)**

---

## 6. Styling & Design

### Design System

**Color Palette (Dark Theme):**
```css
Primary (Cyan): #00D4DD
Background: #0B1120
Surface: #141B2E
Text Primary: #E2E8F0
Text Secondary: #94A3B8
Text Tertiary: #64748B
Border: rgba(0, 212, 221, 0.3)
```

**Visual Effects:**
- **Glass Morphism:** `backdrop-filter: blur(16px) saturate(140%)`
- **Gradients:** Linear gradients for depth
- **Shadows:** Multiple layered shadows for elevation
- **Animations:** Smooth transitions with cubic-bezier easing

### Key Styling Patterns

**1. Dropdown Fields**
- 16px border radius (curved rectangles)
- Gradient background
- Custom SVG arrow icon
- Hover: Lift effect (-2px) + scale(1.01)
- Focus: 4px cyan glow

**2. Result Cards**
- Glass panel background
- Subtle border
- Inner shadow for depth
- Spacing with 1.5rem gaps

**3. Reasoning Section**
- Section headers with left cyan border (3px)
- Bold text for feature categories
- Bullet points for items
- Proper spacing between sections

**4. ACV Input**
- Large bold text (1.125rem, weight 600)
- Enhanced focus states
- Gradient button with hover effects
- Validation messages color-coded

### Responsive Design

**Breakpoints:**
- Desktop: > 968px (2-column grid)
- Tablet/Mobile: ≤ 968px (1-column stack)

**Mobile Optimizations:**
- Smaller font sizes
- Reduced padding
- Stacked layout
- Touch-friendly button sizes

---

## 7. Deployment Guide

### Local Development

**Prerequisites:**
- Node.js 18.x or higher
- npm or yarn

**Setup Steps:**
```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:3000
```

**Development Scripts:**
```json
{
  "dev": "next dev",       // Start dev server
  "build": "next build",   // Create production build
  "start": "next start",   // Start production server
  "lint": "next lint"      // Run linter
}
```

### Vercel Deployment

**Method 1: GitHub Integration (Recommended)**
1. Push code to GitHub repository
2. Go to vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
6. Click "Deploy"
7. Vercel automatically:
   - Installs dependencies
   - Builds the project
   - Deploys to production
   - Provides a URL (e.g., your-app.vercel.app)

**Method 2: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Automatic Deployments:**
- Every push to main branch → Production deployment
- Every pull request → Preview deployment
- Vercel handles SSL, CDN, and scaling automatically

### Environment Configuration

**next.config.js:**
```javascript
const nextConfig = {
  output: 'standalone',  // Optimized for hosting
  reactStrictMode: true, // Enable React strict mode
  images: {
    domains: [],         // Add if using external images
  },
}
```

---

## 8. Key Features Summary

### For End Users
1. **Intelligent Recommendations** - Multi-factor analysis
2. **Detailed Reasoning** - Transparent decision-making
3. **ACV Validation** - Budget alignment checking
4. **Interactive Tooltips** - Contextual help
5. **Professional UI** - Modern dark theme
6. **Direct Links** - Quick access to package details

### For Developers
1. **Type Safety** - Full TypeScript implementation
2. **Modular Architecture** - Reusable components
3. **CSS Modules** - Scoped styling, no conflicts
4. **Responsive Design** - Mobile-first approach
5. **Easy Deployment** - One-click Vercel integration
6. **Maintainable Code** - Clear separation of concerns

---

## 9. Maintenance & Customization

### Common Customization Tasks

**1. Adjusting Score Thresholds**
Location: `PSPackageRecommender.tsx`, lines 138-144
```typescript
if (totalScore <= 10) {
  packageLevel = 'Starter'
} else if (totalScore <= 18) {
  packageLevel = 'Advanced'
} else {
  packageLevel = 'Premium'
}
```

**2. Updating Pricing**
Location: `PSPackageRecommender.tsx`, lines 149-153
```typescript
const prices: any = {
  'Modernization': { Starter: 20000, Advanced: 50000, Premium: 80000 },
  'Jumpstart AI': { Starter: 5000, Advanced: 20000, Premium: 60000 },
}
```

**3. Modifying Dropdown Options**
Location: `PSPackageRecommender.tsx`, lines 43-95
```typescript
const teamSizeOptions: DropdownOption = {
  'Select...': 0,
  '<10 users': 1,
  // Add/modify options here
}
```

**4. Changing Colors**
Location: `app/globals.css`, lines 1-20
```css
:root {
  --ts-primary: #00D4DD;  /* Change brand color */
  /* Modify other colors */
}
```

**5. Updating Reasoning Content**
Location: `PSPackageRecommender.tsx`, `generateReasoning()` function
- Modify section headers
- Update feature descriptions
- Adjust conditional logic

---

## 10. Troubleshooting

### Common Issues

**Issue: "next is not recognized"**
- Solution: Run `npm install` to install dependencies

**Issue: Logo not displaying**
- Check: `public/thoughtspot-logo.png` exists
- Verify: Image path is correct in Header.tsx

**Issue: Styles not applying**
- Clear browser cache
- Check CSS Module imports
- Verify class names match

**Issue: Deployment fails on Vercel**
- Check: Node version is 18.x+
- Verify: package.json has all dependencies
- Review: Build logs for specific errors

---

## 11. Technical Architecture Diagram

```
┌─────────────────────────────────────────┐
│         User Browser (Client)           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     app/page.tsx (Entry)          │ │
│  │     Renders everything            │ │
│  └───────────┬───────────────────────┘ │
│              │                          │
│  ┌───────────▼───────────────────────┐ │
│  │   Header Component                │ │
│  │   - Logo                          │ │
│  │   - Title                         │ │
│  └───────────────────────────────────┘ │
│              │                          │
│  ┌───────────▼───────────────────────┐ │
│  │ PSPackageRecommender Component    │ │
│  │                                   │ │
│  │  State Management:                │ │
│  │  ├─ formData                      │ │
│  │  ├─ recommendation                │ │
│  │  ├─ acv                           │ │
│  │  └─ acvValidation                 │ │
│  │                                   │ │
│  │  Functions:                       │ │
│  │  ├─ handleSubmit()                │ │
│  │  ├─ generateReasoning()           │ │
│  │  └─ handleAcvValidation()         │ │
│  │                                   │ │
│  │  Renders:                         │ │
│  │  ├─ Form with Dropdowns           │ │
│  │  │   └─ Tooltip Components        │ │
│  │  ├─ Submit Button                 │ │
│  │  └─ Results Section               │ │
│  │      ├─ Package Card              │ │
│  │      ├─ Reasoning Card            │ │
│  │      └─ ACV Validation            │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Styling Layer                   │
├─────────────────────────────────────────┤
│                                         │
│  app/globals.css                        │
│  ├─ CSS Variables                       │
│  ├─ Global styles                       │
│  └─ Animations                          │
│                                         │
│  Component CSS Modules                  │
│  ├─ PSPackageRecommender.module.css    │
│  ├─ Header.module.css                   │
│  └─ Tooltip.module.css                  │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Static Assets                   │
├─────────────────────────────────────────┤
│                                         │
│  public/                                │
│  └─ thoughtspot-logo.png                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 12. Code Flow Sequence

### Form Submission Flow

```
User fills form
    ↓
User clicks "Get Recommendation"
    ↓
handleSubmit(e) triggered
    ↓
e.preventDefault() - Prevent page reload
    ↓
Validate all fields are filled
    ↓
[If validation fails]
    Alert user → STOP
    ↓
[If validation passes]
    Calculate totalScore
    ├─ Sum all dropdown values
    ├─ Add TSE bonus if applicable
    └─ Result: number (7-23)
    ↓
Determine packageLevel
    ├─ if (totalScore <= 10) → 'Starter'
    ├─ if (totalScore <= 18) → 'Advanced'
    └─ if (totalScore > 18) → 'Premium'
    ↓
Determine packageType
    ├─ if (isMigration) → 'Modernization'
    └─ else → 'Jumpstart AI'
    ↓
Combine into recommendedPackage
    Example: "Jumpstart AI Advanced"
    ↓
Look up price from pricing matrix
    prices[packageType][packageLevel]
    ↓
Generate reasoning array
    ├─ Call generateReasoning()
    ├─ Build project summary
    ├─ Explain package fit
    └─ List deliverables
    ↓
Update recommendation state
    {
      package: recommendedPackage,
      score: totalScore,
      price: price,
      reasoning: [array of strings]
    }
    ↓
React re-renders component
    ↓
Results section appears
    ↓
User sees:
    ├─ Package name
    ├─ Score
    ├─ Price
    ├─ Detailed reasoning
    └─ ACV validation input
```

---

## Contact & Support

For questions or issues with this application:
- **Professional Services Team:** Contact via internal channels
- **Technical Support:** Reach out to the PS operations team
- **Feature Requests:** Submit through appropriate channels

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Maintained By:** ThoughtSpot PS Team




