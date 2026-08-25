const sharedSvgProps = {
  className: 'enterprise-illustration',
  fill: 'none',
  focusable: 'false',
}

function Illustration({ type, viewBox, children }) {
  return (
    <svg {...sharedSvgProps} className={`enterprise-illustration enterprise-illustration--${type}`} viewBox={viewBox}>
      <g className="enterprise-illustration-base" stroke="#747985" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        {children}
      </g>
    </svg>
  )
}

function CustomLimitsIllustration() {
  return (
    <Illustration type="limits" viewBox="38 38 244 244">
      <circle className="enterprise-draw" cx="160" cy="160" r="112" />
      <circle className="enterprise-dash" cx="160" cy="160" r="78" strokeDasharray="7 5" />
      <circle className="enterprise-draw enterprise-draw--late" cx="160" cy="160" r="44" />
      <circle className="enterprise-draw enterprise-draw--later" cx="160" cy="160" r="10" />
      <g className="enterprise-node-group">
        <circle cx="248" cy="91" r="8" />
        <circle cx="86" cy="143" r="8" />
        <circle cx="218" cy="219" r="8" />
      </g>
      <circle className="enterprise-motion-layer enterprise-motion-ring enterprise-motion-ring--limits" cx="160" cy="160" r="78" strokeDasharray="7 5" />
    </Illustration>
  )
}

function PriorityProcessingIllustration() {
  return (
    <Illustration type="priority" viewBox="38 37 244 276">
      <path className="enterprise-draw enterprise-priority-core" d="M160 85 220 120 160 155 100 120 160 85ZM100 120v70l60 35 60-35v-70M160 155v70" />
      <path className="enterprise-draw enterprise-draw--late enterprise-priority-satellite enterprise-priority-satellite--left" d="M72 47 96 61 72 75 48 61 72 47ZM48 61v28l24 14 24-14V61M72 75v28" />
      <path className="enterprise-draw enterprise-draw--late enterprise-priority-satellite enterprise-priority-satellite--right" d="m248 47 24 14-24 14-24-14 24-14ZM224 61v28l24 14 24-14V61M248 75v28" />
      <path className="enterprise-draw enterprise-draw--later enterprise-priority-satellite enterprise-priority-satellite--bottom" d="m160 247 24 14-24 14-24-14 24-14ZM136 261v28l24 14 24-14v-28M160 275v28" />
      <path className="enterprise-dash" d="m96 91 23 14M224 91l-23 14M160 225v22" strokeDasharray="7 5" />
      <path className="enterprise-motion-layer enterprise-motion-dash enterprise-motion-dash--priority" d="m96 91 23 14M224 91l-23 14M160 225v22" strokeDasharray="7 5" />
    </Illustration>
  )
}

function DeploymentOptionsIllustration() {
  return (
    <Illustration type="deployment" viewBox="39 25 242 270">
      <path className="enterprise-dash" d="m160 35 111 64v122l-111 64L49 221V99L160 35Z" strokeDasharray="7 5" />
      <path className="enterprise-draw" d="m160 52 96 55v106l-96 55-96-55V107l96-55Z" />
      <path className="enterprise-draw enterprise-deployment-layer enterprise-deployment-layer--top" d="m160 85 64 37-64 37-64-37 64-37Z" />
      <path className="enterprise-draw enterprise-draw--late enterprise-deployment-layer enterprise-deployment-layer--middle" d="m160 123 64 37-64 37-64-37 64-37Z" />
      <path className="enterprise-draw enterprise-draw--later enterprise-deployment-layer enterprise-deployment-layer--bottom" d="m160 161 64 37-64 37-64-37 64-37Z" />
      <path className="enterprise-motion-layer enterprise-motion-dash enterprise-motion-dash--deployment" d="m160 35 111 64v122l-111 64L49 221V99L160 35Z" strokeDasharray="7 5" />
    </Illustration>
  )
}

function SupportRequirementsIllustration() {
  return (
    <Illustration type="support" viewBox="30 68 260 212">
      <circle className="enterprise-draw enterprise-support-circle enterprise-support-circle--left" cx="112" cy="140" r="62" />
      <circle className="enterprise-draw enterprise-draw--late enterprise-support-circle enterprise-support-circle--right" cx="208" cy="140" r="62" />
      <circle className="enterprise-draw enterprise-draw--later" cx="160" cy="140" r="10" />
      <path className="enterprise-dash" d="M48 205c27 43 65 65 112 65s85-22 112-65" strokeDasharray="7 5" />
      <circle cx="46" cy="202" r="8" />
      <circle cx="274" cy="202" r="8" />
      <path className="enterprise-motion-layer enterprise-motion-dash enterprise-motion-dash--support" d="M48 205c27 43 65 65 112 65s85-22 112-65" strokeDasharray="7 5" />
    </Illustration>
  )
}

function SlaRequirementsIllustration() {
  return (
    <Illustration type="sla" viewBox="33 33 254 254">
      <circle className="enterprise-dash" cx="160" cy="160" r="117" strokeDasharray="7 5" />
      <g className="enterprise-node-group">
        <circle cx="160" cy="43" r="8" />
        <circle cx="59" cy="219" r="8" />
        <circle cx="261" cy="219" r="8" />
      </g>
      <path className="enterprise-draw" d="m160 85 67 39-67 39-67-39 67-39ZM93 124v78l67 39 67-39v-78M160 163v78" />
      <circle className="enterprise-motion-layer enterprise-motion-ring enterprise-motion-ring--sla" cx="160" cy="160" r="117" strokeDasharray="7 5" />
    </Illustration>
  )
}

function CommercialTermsIllustration() {
  return (
    <Illustration type="commercial" viewBox="32 47 268 204">
      <ellipse className="enterprise-draw" cx="120" cy="88" rx="78" ry="31" />
      <path className="enterprise-draw enterprise-draw--late" d="M42 88v122c0 17 35 31 78 31s78-14 78-31V88M42 130c0 17 35 31 78 31s78-14 78-31M42 171c0 17 35 31 78 31s78-14 78-31" />
      <ellipse className="enterprise-dash" cx="250" cy="163" rx="40" ry="18" strokeDasharray="7 5" />
      <path className="enterprise-dash" d="M210 163v48c0 10 18 18 40 18s40-8 40-18v-48" strokeDasharray="7 5" />
      <g className="enterprise-motion-layer enterprise-motion-commercial-scan">
        <path d="M42 130c0 17 35 31 78 31s78-14 78-31" />
        <path d="M42 171c0 17 35 31 78 31s78-14 78-31" />
      </g>
      <g className="enterprise-motion-layer enterprise-motion-dash enterprise-motion-dash--commercial" strokeDasharray="7 5">
        <ellipse cx="250" cy="163" rx="40" ry="18" />
        <path d="M210 163v48c0 10 18 18 40 18s40-8 40-18v-48" />
      </g>
    </Illustration>
  )
}

const illustrations = {
  limits: CustomLimitsIllustration,
  priority: PriorityProcessingIllustration,
  deployment: DeploymentOptionsIllustration,
  support: SupportRequirementsIllustration,
  sla: SlaRequirementsIllustration,
  commercial: CommercialTermsIllustration,
}

export function EnterpriseIllustration({ type }) {
  const Component = illustrations[type]
  return Component ? <Component /> : null
}
