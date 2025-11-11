'use client'

import { useState } from 'react'
import Tooltip from './Tooltip'
import styles from './PSPackageRecommender.module.css'

interface FormData {
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

interface DropdownOption {
  [key: string]: number
}

export default function PSPackageRecommender() {
  const [formData, setFormData] = useState<FormData>({
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

  const [recommendation, setRecommendation] = useState<any>(null)
  const [acv, setAcv] = useState<string>('')
  const [acvValidation, setAcvValidation] = useState<any>(null)

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

  const dataComplexityOptions: DropdownOption = {
    'Select...': 0,
    'Single data source (simple schema)': 1,
    'Multiple data sources (moderate complexity)': 2,
    'Complex multi-source integration (advanced)': 3,
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

    let totalScore = 
      teamSizeOptions[formData.teamSize] +
      primaryNeedOptions[formData.primaryNeed] +
      dataComplexityOptions[formData.dataComplexity] +
      businessLogicOptions[formData.businessLogic] +
      securityReqOptions[formData.securityReq] +
      useCasesOptions[formData.useCases] +
      goLiveOptions[formData.goLive]

    if (formData.tsaTse === 'TSE (ThoughtSpot Embedding)' && formData.tseType === 'Custom Actions') {
      totalScore += 1
    }

    let packageLevel = ''
    if (totalScore <= 10) {
      packageLevel = 'Starter'
    } else if (totalScore <= 18) {
      packageLevel = 'Advanced'
    } else {
      packageLevel = 'Premium'
    }

    const packageType = formData.isMigration ? 'Modernization' : 'Jumpstart AI'
    const recommendedPackage = `${packageType} ${packageLevel}`
    
    const prices: any = {
      'Modernization': { Starter: 20000, Advanced: 50000, Premium: 80000 },
      'Jumpstart AI': { Starter: 5000, Advanced: 20000, Premium: 60000 },
    }
    const price = prices[packageType][packageLevel]

    const reasoning = generateReasoning(
      totalScore,
      formData,
      recommendedPackage,
      packageLevel
    )

    setRecommendation({
      package: recommendedPackage,
      score: totalScore,
      price,
      reasoning,
    })
    setAcvValidation(null)
  }

  const generateReasoning = (
    totalScore: number,
    formData: FormData,
    recommendedPackage: string,
    packageLevel: string
  ) => {
    const reasons = []

    // Project Overview Section
    reasons.push('**Your Project at a Glance:**')
    
    const projectType = formData.isMigration ? 'migrating from an existing BI platform' : 'implementing a new ThoughtSpot deployment'
    reasons.push(`• You're ${projectType} with a ${formData.primaryNeed.toLowerCase()} as your primary objective`)
    reasons.push(`• Expected team size of ${formData.teamSize.toLowerCase()} at go-live`)
    reasons.push(`• Deployment architecture: ${formData.tsaTse}${formData.tsaTse.includes('TSE') ? ` (${formData.tseType})` : ''}`)
    
    const dataComplexityMap: { [key: string]: string } = {
      'Single data source (simple schema)': 'single data source',
      'Multiple data sources (moderate complexity)': 'multiple data sources',
      'Complex multi-source integration (advanced)': 'complex multi-source integration'
    }
    reasons.push(`• Data complexity: ${dataComplexityMap[formData.dataComplexity] || formData.dataComplexity}`)
    
    if (formData.useCases === '>1 (Multiple)') {
      reasons.push('• Multiple use cases across different business areas')
    }

    // Why This Package Fits Section
    reasons.push('')
    reasons.push('**Why This Package is the Right Fit:**')
    
    let complexityDescription = ''
    let alignmentReason = ''
    
    if (totalScore <= 12) {
      complexityDescription = 'straightforward implementation with focused requirements'
      alignmentReason = `The ${packageLevel} package is designed for teams getting started with ThoughtSpot who need core platform capabilities without extensive customization.`
    } else if (totalScore <= 20) {
      complexityDescription = 'moderate complexity requiring balanced guidance and hands-on support'
      alignmentReason = `The ${packageLevel} package provides the right mix of strategic guidance and technical implementation support for organizations scaling their analytics capabilities.`
    } else {
      complexityDescription = 'enterprise-scale deployment with sophisticated requirements'
      alignmentReason = `The ${packageLevel} package delivers comprehensive support and strategic partnership needed for large-scale, mission-critical implementations.`
    }
    
    reasons.push(`• Your project profile indicates a ${complexityDescription}`)
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
    
    if (packageLevel === 'Starter') {
      reasons.push('• **Core Platform Setup:** Environment configuration, data source connection, and security implementation')
      reasons.push('• **Training & Enablement:** Hands-on training for your team to get started with ThoughtSpot')
      reasons.push('• **Use Case Development:** One production-ready Liveboard with best practices')
      reasons.push('• **Knowledge Transfer:** Documentation and best practice guidelines for ongoing success')
    } else if (packageLevel === 'Advanced') {
      reasons.push('• **Comprehensive Implementation:** Full environment setup, data modeling, and advanced configuration')
      reasons.push('• **Training & Enablement:** Comprehensive training covering search, Liveboards, and administration')
      reasons.push('• **Multiple Use Cases:** Production-ready Liveboards and Answers with business logic implementation')
      reasons.push('• **Rollout Planning:** Go-live strategy, user adoption planning, and change management support')
      reasons.push('• **Ongoing Support:** Best practices documentation and post-launch guidance')
      if (formData.businessLogic.includes('Advanced')) {
        reasons.push('• **Advanced Analytics:** Custom formulas, calculations, and complex business logic implementation')
      }
    } else { // Premium
      reasons.push('• **Strategic Partnership:** Dedicated expert team for co-development and architectural guidance')
      reasons.push('• **Extensive Training:** Role-based training for analysts, power users, and administrators')
      reasons.push('• **Enterprise-Scale Deployment:** Multiple use cases with complex data integrations and advanced features')
      reasons.push('• **Advanced Features:** Custom actions, complex security models, and sophisticated business logic')
      reasons.push('• **Iterative Rollout:** Phased deployment strategy with continuous optimization')
      reasons.push('• **Executive Engagement:** Regular business reviews and success metrics tracking')
      if (formData.securityReq.includes('Advanced')) {
        reasons.push('• **Advanced Security:** User-level RLS, compliance controls, and audit framework implementation')
      }
    }

    return reasons
  }

  const handleAcvValidation = () => {
    const acvNumber = Number(acv)
    
    if (!acv || acvNumber <= 0) {
      alert('Please enter a valid ACV greater than 0.')
      return
    }

    let allowedLevels: string[] = []
    let allowedStr = ''

    if (acvNumber < 100000) {
      allowedLevels = ['Starter', 'Advanced']
      allowedStr = 'Starter or Advanced package'
    } else if (acvNumber >= 100000 && acvNumber < 150000) {
      allowedLevels = ['Advanced']
      allowedStr = 'Advanced package'
    } else {
      allowedLevels = ['Premium']
      allowedStr = 'Premium package'
    }

    const recLevel = recommendation.package.split(' ').pop()

    if (allowedLevels.includes(recLevel)) {
      setAcvValidation({
        valid: true,
        message: `The recommendation (${recommendation.package}) aligns with ACV $${acvNumber.toLocaleString()}. Proceed confidently.`,
      })
    } else {
      const packageType = recommendation.package.split(' ')[0] + ' ' + recommendation.package.split(' ')[1]
      setAcvValidation({
        valid: false,
        message: `Rethink for ACV $${acvNumber.toLocaleString()}: Suggest ${allowedStr} (${packageType} ${allowedStr.toLowerCase()}) instead of ${recLevel}. Alternatively, reach out to the PS team for further guidance.`,
      })
    }
  }

  const tooltips = {
    teamSize: 'Expected number of users at go-live: This represents the total number of end users who will actively use ThoughtSpot once the use case is fully deployed. Consider all departments and roles that will need access to analytics and insights. This helps determine the scale of deployment and training needs.',
    primaryNeed: 'Primary business objective: Select "Proof of Concept" if you\'re exploring ThoughtSpot\'s capabilities and validating fit with a pilot project. Choose "Production-ready polished use case" if you need a fully functional, enterprise-grade solution ready for broad deployment with complete data models, security, and governance in place.',
    dataComplexity: 'Data architecture complexity: "Single data source" means connecting one database or data warehouse with straightforward tables. "Multiple data sources" involves integrating 2-3 different systems with moderate relationships. "Complex multi-source integration" indicates advanced scenarios with many sources, intricate joins, data blending, or real-time requirements.',
    businessLogic: 'Business calculation requirements: "Standard aggregations" covers basic metrics like sum, count, average, and simple calculations. "Advanced formulas, custom calendars" includes complex KPIs, custom fiscal periods, cohort analysis, advanced statistical functions, or sophisticated business rules requiring formula expertise.',
    securityReq: 'Data security and compliance needs: "Basic group RLS" (Row-Level Security) allows access control by user groups or departments. "Advanced user-level, compliance-heavy" requires granular permissions per individual user, strict audit trails, GDPR/HIPAA compliance, or complex data masking and governance policies.',
    useCases: 'Number of use cases to implement: Select "1" if you\'re focusing on a single business area or department (e.g., Sales Analytics only). Choose ">1 (Multiple)" if you\'re deploying across multiple departments or business functions (e.g., Sales, Marketing, Operations, Finance) requiring different data models and analytics.',
    goLive: 'Implementation support level: "Guided/advisory" means you have internal resources to do the work with expert guidance, best practices, and architectural reviews. "Hands on support/co-build" indicates you need ThoughtSpot consultants actively building alongside your team, doing data modeling, creating content, and configuring the platform.',
    tsaTse: 'Deployment architecture: "TSA (ThoughtSpot Cloud)" is the standalone SaaS platform accessed via web browser for internal business intelligence. "TSE (ThoughtSpot Embedding)" embeds analytics directly into your own applications or products, providing a white-labeled, integrated analytics experience for your customers or users.',
    tseType: 'Embedding complexity (TSE only): "Out of Box TSE" uses standard ThoughtSpot embedding with basic customization and theming. "Custom Actions" involves advanced integration with custom workflows, write-back capabilities to external systems, or triggering actions in your applications based on data insights.',
    isMigration: 'Migration vs. new implementation: Check this if you\'re migrating from an existing BI tool (Tableau, Power BI, Looker, QlikView, etc.) and need help recreating dashboards, migrating content, user adoption, and change management. Uncheck for brand new ThoughtSpot deployments without prior BI systems.',
  }

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        Answer the questions below to recommend the best ThoughtSpot Professional Services package.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
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
          </div>

          <div className={styles.column}>
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

            <div className={styles.field}>
              <Tooltip content={tooltips.tseType}>
                <label className={styles.label}>TSE Type (if TSE selected)</label>
              </Tooltip>
              <select
                className={styles.select}
                value={formData.tseType}
                onChange={(e) => setFormData({ ...formData, tseType: e.target.value })}
                disabled={formData.tsaTse !== 'TSE (ThoughtSpot Embedding)'}
              >
                {Object.keys(tseTypeOptions).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit & Recommend
        </button>
      </form>

      {recommendation && (
        <div className={styles.results}>
          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>✅ Recommended Package</h2>
            <div className={styles.recommendationBox}>
              <h3 className={styles.packageName}>{recommendation.package}</h3>
              <div className={styles.packageDetails}>
                <span className={styles.detail}>Score: {recommendation.score}</span>
                <span className={styles.detail}>Approx. Price: ${recommendation.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>💡 Why We Recommend {recommendation.package}</h2>
            <div className={styles.reasoningList}>
              {recommendation.reasoning.map((reason: string, index: number) => {
                // Check if it's a section header (starts with **)
                if (reason.startsWith('**') && reason.endsWith(':**')) {
                  const headerText = reason.replace(/\*\*/g, '')
                  return (
                    <h3 key={index} className={styles.reasoningHeader}>
                      {headerText}
                    </h3>
                  )
                }
                
                // Check if it's empty (section separator)
                if (reason.trim() === '') {
                  return <div key={index} className={styles.reasoningSpacer}></div>
                }
                
                // Parse markdown bold syntax **text**
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

          <div className={styles.resultCard}>
            <h2 className={styles.resultTitle}>💰 ACV Validation</h2>
            <p className={styles.acvDescription}>
              Enter the account's Annual Contract Value (ACV) to validate the recommendation.
            </p>
            <div className={styles.acvInput}>
              <input
                type="number"
                className={styles.numberInput}
                value={acv}
                onChange={(e) => setAcv(e.target.value)}
                placeholder="Enter ACV in USD"
                min="0"
                step="1000"
              />
              <button onClick={handleAcvValidation} className={styles.validateButton}>
                Validate with ACV
              </button>
            </div>
            {acvValidation && (
              <div className={acvValidation.valid ? styles.validationSuccess : styles.validationWarning}>
                {acvValidation.message}
                {!acvValidation.valid && (
                  <div className={styles.contactTable}>
                    <h3 className={styles.contactTitle}>📞 Contact PS Team</h3>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Region</th>
                          <th>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>NA</td>
                          <td>MJ Densmore</td>
                        </tr>
                        <tr>
                          <td>NA</td>
                          <td>Carolyn Chupa</td>
                        </tr>
                        <tr>
                          <td>EMEA</td>
                          <td>Camilla Tanzi</td>
                        </tr>
                        <tr>
                          <td>EMEA</td>
                          <td>Hetarth Chokshi</td>
                        </tr>
                        <tr>
                          <td>Scale</td>
                          <td>Arjun Krishnan</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

