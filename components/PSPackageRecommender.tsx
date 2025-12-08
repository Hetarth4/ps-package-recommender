'use client'

import { useState } from 'react'
import Tooltip from './Tooltip'
import styles from './PSPackageRecommender.module.css'

// ============================================
// CONFIGURATION - Easy to update labels/values
// ============================================

// TODO: Update these labels as needed for clarity
const DATA_SOURCE_LABELS = {
  single: 'Single TS data model, single underlying source',
  multipleUnified: 'Single TS data model, multiple underlying sources already unified in CDW',
  complex: 'Multiple TS data models or complex cross-system integrations',
}

// PSC Team Contact - Configurable
const PSC_CONTACT = {
  email: 'psc-team@thoughtspot.com',
  slackChannel: '#ps-consulting',
  contacts: [
    { name: 'MJ Densmore', region: 'NA' },
    { name: 'Carolyn Chupa', region: 'NA' },
    { name: 'Camilla Tanzi', region: 'EMEA' },
    { name: 'Hetarth Chokshi', region: 'EMEA' },
    { name: 'Arjun Krishnan', region: 'Scale' },
  ],
}

// Package Thresholds
const THRESHOLDS = {
  foundation: 11,  // 0-11 = Foundation
  advanced: 16,    // >11-16 = Advanced (Jumpstart AI Advanced)
  // >16 = Premium
}

// ACV Tiers
const ACV_TIERS = {
  lowMax: 110000,    // ≤110K → Force Advanced
  grayMax: 140000,   // 110K-140K → Gray area, no change
  // ≥140K → Push toward Premium
}

// Package Features for comparison
const PACKAGE_FEATURES = {
  Foundation: {
    name: 'Jumpstart AI Foundation',
    features: [
      'Core Platform Setup & Configuration',
      'Basic Training & Enablement',
      'Single Use Case Development',
      'Knowledge Transfer & Documentation',
    ],
    price: 5000,
  },
  Advanced: {
    name: 'Jumpstart AI Advanced',
    features: [
      'Comprehensive Implementation',
      'Advanced Training (Search, Liveboards, Admin)',
      'Multiple Use Cases with Business Logic',
      'Rollout Planning & Change Management',
      'Post-launch Guidance',
    ],
    price: 20000,
  },
  Premium: {
    name: 'Jumpstart AI Premium',
    features: [
      'Strategic Partnership & Co-development',
      'Role-based Training (Analysts, Power Users, Admins)',
      'Enterprise-scale Multi-use Case Deployment',
      'Advanced Features (Custom Actions, Complex Security)',
      'Phased Rollout with Continuous Optimization',
      'Executive Engagement & Success Metrics',
    ],
    price: 60000,
  },
}

// Modernization Package Prices
const MODERNIZATION_PRICES = {
  Foundation: 20000,
  Advanced: 50000,
  Premium: 80000,
}

// ============================================
// TYPES
// ============================================

interface FormData {
  acv: string  // Moved to Step 1
  teamSize: string
  primaryNeed: string
  dataComplexity: string
  businessLogic: string
  securityReq: string
  useCases: string
  goLive: string
  tsaTse: string
  tseType: string
  isMigration: boolean
}

interface RecommendationResult {
  score: number
  baseRecommendation: string
  finalRecommendation: string
  explanation: {
    reasonForChange: string | null
    featuresGainedLost: string[]
    ctaToPSC: boolean
    premiumOptional?: boolean
  }
  package: string
  price: number
  reasoning: string[]
}

interface DropdownOption {
  [key: string]: number
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PSPackageRecommender() {
  const [formData, setFormData] = useState<FormData>({
    acv: '',  // ACV now in Step 1
    teamSize: 'Select...',
    primaryNeed: 'Select...',
    dataComplexity: 'Select...',
    businessLogic: 'Select...',
    securityReq: 'Select...',
    useCases: 'Select...',
    goLive: 'Select...',
    tsaTse: 'Select...',
    tseType: 'Select...',
    isMigration: false,
  })

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null)

  // Dropdown options with scores
  const teamSizeOptions: DropdownOption = {
    'Select...': 0,
    '<10 users': 1,
    '10–50 users': 2,
    '50–100 users': 3,
    'Hundreds of users (enterprise-wide)': 4,
  }

  const primaryNeedOptions: DropdownOption = {
    'Select...': 0,
    'Proof of Concept': 1,
    'Production-ready polished use case': 2,
  }

  // Using configurable labels
  const dataComplexityOptions: DropdownOption = {
    'Select...': 0,
    [DATA_SOURCE_LABELS.single]: 1,
    [DATA_SOURCE_LABELS.multipleUnified]: 2,
    [DATA_SOURCE_LABELS.complex]: 3,
  }

  const businessLogicOptions: DropdownOption = {
    'Select...': 0,
    'Standard aggregations': 1,
    'Advanced formulas, custom calendars': 3,
  }

  const securityReqOptions: DropdownOption = {
    'Select...': 0,
    'Basic group RLS': 1,
    'Advanced user-level, compliance-heavy': 3,
  }

  const useCasesOptions: DropdownOption = {
    'Select...': 0,
    '1': 1,
    '>1 (Multiple)': 3,
  }

  const goLiveOptions: DropdownOption = {
    'Select...': 0,
    'Guided/advisory': 1,
    'Hands on support/co-build': 3,
  }

  const tseTypeOptions: DropdownOption = {
    'Select...': 0,
    'Out of Box TSE': 1,
    'Custom Actions': 2,
  }

  // ============================================
  // RECOMMENDATION PIPELINE
  // ============================================

  /**
   * Step 1: Calculate complexity score
   */
  const calculateScore = (inputs: FormData): number => {
    let score = 
      teamSizeOptions[inputs.teamSize] +
      primaryNeedOptions[inputs.primaryNeed] +
      dataComplexityOptions[inputs.dataComplexity] +
      businessLogicOptions[inputs.businessLogic] +
      securityReqOptions[inputs.securityReq] +
      useCasesOptions[inputs.useCases] +
      goLiveOptions[inputs.goLive]

    // Add TSE custom actions bonus
    if (inputs.tsaTse === 'TSE (ThoughtSpot Embedding)' && inputs.tseType === 'Custom Actions') {
      score += 1
    }

    return score
  }

  /**
   * Step 2: Get base recommendation from score only
   */
  const getBaseRecommendation = (score: number): string => {
    if (score <= THRESHOLDS.foundation) {
      return 'Foundation'
    } else if (score <= THRESHOLDS.advanced) {
      return 'Advanced'
    } else {
      return 'Premium'
    }
  }

  /**
   * Step 3: Apply ACV logic to get final recommendation
   */
  const applyAcvLogic = (baseRecommendation: string, acv: number): { 
    final: string, 
    flagPremiumOptional: boolean,
    reasonForChange: string | null,
    featuresGainedLost: string[]
  } => {
    let final = baseRecommendation
    let flagPremiumOptional = false
    let reasonForChange: string | null = null
    let featuresGainedLost: string[] = []

    // ACV ≤ 110K → Force Advanced (even if base says Premium)
    if (acv <= ACV_TIERS.lowMax) {
      if (baseRecommendation === 'Premium') {
        final = 'Advanced'
        reasonForChange = `Due to ACV of $${acv.toLocaleString()} (≤$110K), we recommend Advanced instead of Premium to better align with deal value.`
        featuresGainedLost = [
          '❌ Removed: Strategic Partnership & Co-development',
          '❌ Removed: Executive Engagement & Success Metrics',
          '❌ Removed: Enterprise-scale deployment features',
          '✅ Retained: Comprehensive implementation',
          '✅ Retained: Multiple use cases with business logic',
          '✅ Retained: Post-launch guidance',
        ]
      }
    }
    // 110K < ACV < 140K → Gray area, no change
    else if (acv > ACV_TIERS.lowMax && acv < ACV_TIERS.grayMax) {
      // No change - keep base recommendation
      final = baseRecommendation
    }
    // ACV ≥ 140K → Push toward Premium
    else if (acv >= ACV_TIERS.grayMax) {
      if (baseRecommendation === 'Advanced') {
        final = 'Premium'
        reasonForChange = `With ACV of $${acv.toLocaleString()} (≥$140K), the deal value justifies upgrading to Premium for maximum value delivery.`
        featuresGainedLost = [
          '✅ Added: Strategic Partnership & Co-development',
          '✅ Added: Role-based training for all user types',
          '✅ Added: Executive Engagement & Success Metrics',
          '✅ Added: Phased rollout with continuous optimization',
          '✅ Added: Advanced features (Custom Actions, Complex Security)',
        ]
      } else if (baseRecommendation === 'Foundation') {
        // Edge case: Foundation with high ACV
        final = 'Advanced'
        flagPremiumOptional = true
        reasonForChange = `High ACV of $${acv.toLocaleString()} suggests upgrading from Foundation to at least Advanced. Premium may also be appropriate.`
        featuresGainedLost = [
          '✅ Added: Comprehensive implementation',
          '✅ Added: Advanced training',
          '✅ Added: Multiple use cases with business logic',
          '✅ Added: Rollout planning & change management',
          '💡 Consider Premium for strategic partnership',
        ]
      }
    }

    return { final, flagPremiumOptional, reasonForChange, featuresGainedLost }
  }

  /**
   * Step 4: Build explanation object
   */
  const buildExplanation = (
    score: number,
    acv: number,
    baseRecommendation: string,
    finalRecommendation: string,
    acvResult: { reasonForChange: string | null, featuresGainedLost: string[], flagPremiumOptional: boolean }
  ) => {
    const ctaToPSC = baseRecommendation !== finalRecommendation || acvResult.flagPremiumOptional
    
    return {
      reasonForChange: acvResult.reasonForChange,
      featuresGainedLost: acvResult.featuresGainedLost,
      ctaToPSC,
      premiumOptional: acvResult.flagPremiumOptional,
    }
  }

  /**
   * Main calculation function - Pipeline
   */
  const calculateRecommendation = (inputs: FormData): RecommendationResult => {
    const score = calculateScore(inputs)
    const baseRecommendation = getBaseRecommendation(score)
    const acvNumber = Number(inputs.acv) || 0
    
    const acvResult = applyAcvLogic(baseRecommendation, acvNumber)
    const finalRecommendation = acvResult.final

    const explanation = buildExplanation(
      score,
      acvNumber,
      baseRecommendation,
      finalRecommendation,
      acvResult
    )

    // Build package name
    const packageType = inputs.isMigration ? 'Modernization' : 'Jumpstart AI'
    const packageName = `${packageType} ${finalRecommendation}`
    
    // Get price
    const price = inputs.isMigration 
      ? MODERNIZATION_PRICES[finalRecommendation as keyof typeof MODERNIZATION_PRICES]
      : PACKAGE_FEATURES[finalRecommendation as keyof typeof PACKAGE_FEATURES].price

    // Generate reasoning
    const reasoning = generateReasoning(score, inputs, packageName, finalRecommendation, baseRecommendation, acvNumber)

    return {
      score,
      baseRecommendation,
      finalRecommendation,
      explanation,
      package: packageName,
      price,
      reasoning,
    }
  }

  // ============================================
  // REASONING GENERATOR
  // ============================================

  const generateReasoning = (
    totalScore: number,
    formData: FormData,
    recommendedPackage: string,
    packageLevel: string,
    baseLevel: string,
    acv: number
  ): string[] => {
    const reasons = []

    // Project Overview Section
    reasons.push('**Your Project at a Glance:**')
    
    const projectType = formData.isMigration ? 'migrating from an existing BI platform' : 'implementing a new ThoughtSpot deployment'
    reasons.push(`• You're ${projectType} with a ${formData.primaryNeed.toLowerCase()} as your primary objective`)
    reasons.push(`• Expected team size of ${formData.teamSize.toLowerCase()} at go-live`)
    reasons.push(`• Annual Contract Value (ACV): $${acv.toLocaleString()}`)
    reasons.push(`• Deployment architecture: ${formData.tsaTse}${formData.tsaTse.includes('TSE') ? ` (${formData.tseType})` : ''}`)
    reasons.push(`• Data complexity: ${formData.dataComplexity}`)
    
    if (formData.useCases === '>1 (Multiple)') {
      reasons.push('• Multiple use cases across different business areas')
    }

    // Score Analysis Section
    reasons.push('')
    reasons.push('**Complexity Analysis:**')
    reasons.push(`• Complexity Score: ${totalScore} out of 22 possible points`)
    
    if (totalScore <= THRESHOLDS.foundation) {
      reasons.push(`• Score indicates a straightforward implementation (0-${THRESHOLDS.foundation} range)`)
    } else if (totalScore <= THRESHOLDS.advanced) {
      reasons.push(`• Score indicates moderate complexity (${THRESHOLDS.foundation + 1}-${THRESHOLDS.advanced} range)`)
    } else {
      reasons.push(`• Score indicates high complexity (>${THRESHOLDS.advanced} range)`)
    }

    // Why This Package Fits Section
    reasons.push('')
    reasons.push('**Why This Package is the Right Fit:**')
    
    let alignmentReason = ''
    
    if (packageLevel === 'Foundation') {
      alignmentReason = `The Foundation package is designed for teams getting started with ThoughtSpot who need core platform capabilities without extensive customization.`
    } else if (packageLevel === 'Advanced') {
      alignmentReason = `The Advanced package provides the right mix of strategic guidance and technical implementation support for organizations scaling their analytics capabilities.`
    } else {
      alignmentReason = `The Premium package delivers comprehensive support and strategic partnership needed for large-scale, mission-critical implementations.`
    }
    
    reasons.push(`• ${alignmentReason}`)
    
    if (formData.isMigration) {
      reasons.push('• As a migration project, you\'ll benefit from specialized support in content recreation, user adoption strategies, and change management')
    }
    
    if (formData.tsaTse === 'TSE (ThoughtSpot Embedding)') {
      if (formData.tseType === 'Custom Actions') {
        reasons.push('• Your embedding requirements with custom actions need advanced integration expertise included in this package')
      } else {
        reasons.push('• Your embedded analytics use case aligns with the embedding best practices and setup included in this package')
      }
    }

    // What You'll Get Section
    reasons.push('')
    reasons.push('**What You\'ll Get with This Package:**')
    
    const features = PACKAGE_FEATURES[packageLevel as keyof typeof PACKAGE_FEATURES]?.features || []
    features.forEach(feature => {
      reasons.push(`• **${feature}**`)
    })

    if (formData.businessLogic.includes('Advanced') && packageLevel !== 'Foundation') {
      reasons.push('• **Advanced Analytics:** Custom formulas, calculations, and complex business logic implementation')
    }
    
    if (formData.securityReq.includes('Advanced') && packageLevel === 'Premium') {
      reasons.push('• **Advanced Security:** User-level RLS, compliance controls, and audit framework implementation')
    }

    return reasons
  }

  // ============================================
  // FORM HANDLERS
  // ============================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selections = [
      formData.teamSize,
      formData.primaryNeed,
      formData.dataComplexity,
      formData.businessLogic,
      formData.securityReq,
      formData.useCases,
      formData.goLive,
    ]

    if (selections.includes('Select...') || formData.tsaTse === 'Select...') {
      alert('Please fill out all fields, including Deployment Type.')
      return
    }

    if (!formData.acv || Number(formData.acv) <= 0) {
      alert('Please enter a valid ACV greater than 0.')
      return
    }

    const result = calculateRecommendation(formData)
    setRecommendation(result)
  }

  // ============================================
  // TOOLTIPS
  // ============================================

  const tooltips = {
    acv: 'Annual Contract Value: The total annual revenue from this customer\'s ThoughtSpot subscription. This helps calibrate the appropriate level of Professional Services investment relative to the deal size.',
    teamSize: 'Expected number of users at go-live: This represents the total number of end users who will actively use ThoughtSpot once the use case is fully deployed.',
    primaryNeed: 'Primary business objective: Select "Proof of Concept" if you\'re exploring ThoughtSpot\'s capabilities. Choose "Production-ready polished use case" if you need a fully functional, enterprise-grade solution.',
    dataComplexity: 'Data architecture complexity: Describes how your data sources are structured and integrated with ThoughtSpot.',
    businessLogic: 'Business calculation requirements: "Standard aggregations" covers basic metrics. "Advanced formulas, custom calendars" includes complex KPIs and sophisticated business rules.',
    securityReq: 'Data security and compliance needs: "Basic group RLS" allows access control by user groups. "Advanced user-level, compliance-heavy" requires granular permissions and strict compliance.',
    useCases: 'Number of use cases to implement: Select "1" for a single business area. Choose ">1 (Multiple)" for multiple departments or functions.',
    goLive: 'Implementation support level: "Guided/advisory" means expert guidance with your team doing the work. "Hands on support/co-build" means ThoughtSpot consultants actively building alongside you.',
    tsaTse: 'Deployment architecture: "TSA (ThoughtSpot Cloud)" is standalone SaaS. "TSE (ThoughtSpot Embedding)" embeds analytics into your own applications.',
    tseType: 'Embedding complexity: "Out of Box TSE" uses standard embedding. "Custom Actions" involves advanced integration with custom workflows.',
    isMigration: 'Migration vs. new implementation: Check this if migrating from an existing BI tool.',
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        Answer the questions below to recommend the best ThoughtSpot Professional Services package.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Deal-Level Questions - ACV First */}
        <div className={styles.sectionHeader}>
          <h3>Deal Information</h3>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.column}>
            <div className={styles.field}>
              <Tooltip content={tooltips.acv}>
                <label className={styles.label}>Annual Contract Value (ACV) *</label>
              </Tooltip>
              <div className={styles.acvInputWrapper}>
                <span className={styles.currencyPrefix}>$</span>
                <input
                  type="number"
                  className={styles.numberInput}
                  value={formData.acv}
                  onChange={(e) => setFormData({ ...formData, acv: e.target.value })}
                  placeholder="Enter ACV in USD"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className={styles.field}>
              <Tooltip content={tooltips.isMigration}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.isMigration}
                    onChange={(e) => setFormData({ ...formData, isMigration: e.target.checked })}
                  />
                  Is this a Migration Project?
                </label>
              </Tooltip>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.field}>
              <Tooltip content={tooltips.tsaTse}>
                <label className={styles.label}>Deployment Type (TSA/TSE)</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.tsaTse}
                onChange={(e) => setFormData({ ...formData, tsaTse: e.target.value })}
              >
                <option value="Select...">Select...</option>
                <option value="TSA (ThoughtSpot Cloud)">TSA (ThoughtSpot Cloud)</option>
                <option value="TSE (ThoughtSpot Embedding)">TSE (ThoughtSpot Embedding)</option>
              </select>
            </div>

            {formData.tsaTse === 'TSE (ThoughtSpot Embedding)' && (
              <div className={styles.field}>
                <Tooltip content={tooltips.tseType}>
                  <label className={styles.label}>TSE Type</label>
                </Tooltip>
                <select
                  className={styles.select}
                  value={formData.tseType}
                  onChange={(e) => setFormData({ ...formData, tseType: e.target.value })}
                >
                  {Object.keys(tseTypeOptions).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Complexity Questions */}
        <div className={styles.sectionHeader}>
          <h3>Project Complexity</h3>
        </div>

        <div className={styles.grid}>
          <div className={styles.column}>
            <div className={styles.field}>
              <Tooltip content={tooltips.teamSize}>
                <label className={styles.label}>Number of Users for Go-Live</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              >
                {Object.keys(teamSizeOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <Tooltip content={tooltips.primaryNeed}>
                <label className={styles.label}>Primary Need</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.primaryNeed}
                onChange={(e) => setFormData({ ...formData, primaryNeed: e.target.value })}
              >
                {Object.keys(primaryNeedOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <Tooltip content={tooltips.dataComplexity}>
                <label className={styles.label}>Data Composition</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.dataComplexity}
                onChange={(e) => setFormData({ ...formData, dataComplexity: e.target.value })}
              >
                {Object.keys(dataComplexityOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <Tooltip content={tooltips.businessLogic}>
                <label className={styles.label}>Business Logic Needs</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.businessLogic}
                onChange={(e) => setFormData({ ...formData, businessLogic: e.target.value })}
              >
                {Object.keys(businessLogicOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.field}>
              <Tooltip content={tooltips.securityReq}>
                <label className={styles.label}>Security Requirements</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.securityReq}
                onChange={(e) => setFormData({ ...formData, securityReq: e.target.value })}
              >
                {Object.keys(securityReqOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <Tooltip content={tooltips.useCases}>
                <label className={styles.label}>Number of Use Cases</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.useCases}
                onChange={(e) => setFormData({ ...formData, useCases: e.target.value })}
              >
                {Object.keys(useCasesOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <Tooltip content={tooltips.goLive}>
                <label className={styles.label}>Level of Implementation Support Required</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.goLive}
                onChange={(e) => setFormData({ ...formData, goLive: e.target.value })}
              >
                {Object.keys(goLiveOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Get Recommendation
        </button>
      </form>

      {recommendation && (
        <div className={styles.results}>
          {/* Main Recommendation */}
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>✅ Recommended Package</h2>
            <div className={styles.recommendationBox}>
              <h3 className={styles.packageName}>{recommendation.package}</h3>
              <div className={styles.packageDetails}>
                <span className={styles.detail}>Complexity Score: {recommendation.score}</span>
                <span className={styles.detail}>Approx. Price: ${recommendation.price.toLocaleString()}</span>
              </div>
              {recommendation.baseRecommendation !== recommendation.finalRecommendation && (
                <div className={styles.scoreBreakdown}>
                  <span className={styles.baseScore}>
                    Base recommendation (from complexity): {recommendation.baseRecommendation}
                  </span>
                  <span className={styles.finalScore}>
                    → Adjusted for ACV: {recommendation.finalRecommendation}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ACV Adjustment Explanation (if changed) */}
          {recommendation.explanation.reasonForChange && (
            <div className={styles.resultCard}>
              <h2 className={styles.resultTitle}>📊 ACV-Based Adjustment</h2>
              <div className={styles.acvExplanation}>
                <p className={styles.reasonText}>{recommendation.explanation.reasonForChange}</p>
                <div className={styles.featuresList}>
                  <h4>Impact on Package Features:</h4>
                  {recommendation.explanation.featuresGainedLost.map((feature, idx) => (
                    <div key={idx} className={styles.featureItem}>{feature}</div>
                  ))}
                </div>
                {recommendation.explanation.premiumOptional && (
                  <div className={styles.premiumNote}>
                    💡 <strong>Note:</strong> Given the high ACV, Premium package could also be a strong fit. Consider discussing with the PSC team.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alignment Message (if no change) */}
          {!recommendation.explanation.reasonForChange && (
            <div className={styles.resultCard}>
              <h2 className={styles.resultTitle}>✅ ACV Alignment</h2>
              <div className={styles.alignmentMessage}>
                <p>ACV of ${Number(formData.acv).toLocaleString()} is well-aligned with the complexity-based recommendation. The {recommendation.finalRecommendation} package is appropriate for this deal.</p>
              </div>
            </div>
          )}

          {/* Reasoning */}
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>💡 Why We Recommend {recommendation.package}</h2>
            <div className={styles.reasoningList}>
              {recommendation.reasoning.map((reason: string, index: number) => {
                if (reason.startsWith('**') && reason.endsWith(':**')) {
                  const headerText = reason.replace(/\*\*/g, '')
                  return (
                    <h3 key={index} className={styles.reasoningHeader}>
                      {headerText}
                    </h3>
                  )
                }
                
                if (reason.trim() === '') {
                  return <div key={index} className={styles.reasoningSpacer}></div>
                }
                
                const parts = reason.split(/(\*\*.*?\*\*)/)
                
                return (
                  <div key={index} className={styles.reasoningItem}>
                    {parts.map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i}>{part.slice(2, -2)}</strong>
                      }
                      return <span key={i}>{part}</span>
                    })}
                  </div>
                )
              })}
            </div>
            <a
              href="https://docs.google.com/presentation/d/1pM38OTjtXXOGec_amVXO_dqnvfk2R24uGgjfPyE8UPI/edit?slide=id.g31b73a28df8_1_1472#slide=id.g31b73a28df8_1_1472"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.presentationLink}
            >
              View {recommendation.package} Presentation →
            </a>
          </div>

          {/* PSC Team CTA */}
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>📞 Need Help?</h2>
            <div className={styles.pscCta}>
              <p className={styles.ctaText}>
                If this recommendation doesn't feel right for your deal, or if you need additional guidance, 
                please connect with the PSC team to discuss the best package for your customer.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactMethod}>
                  <strong>Slack:</strong> {PSC_CONTACT.slackChannel}
                </div>
              </div>
              <div className={styles.contactTable}>
                <h4 className={styles.contactTitle}>Regional Contacts:</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PSC_CONTACT.contacts.map((contact, idx) => (
                      <tr key={idx}>
                        <td>{contact.region}</td>
                        <td>{contact.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Tag */}
      <div className={styles.versionTag}>
        PS Package Recommender v1.1 • Updated December 2025
      </div>
    </div>
  )
}
