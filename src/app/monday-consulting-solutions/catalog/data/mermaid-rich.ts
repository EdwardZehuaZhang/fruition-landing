// Rich Mermaid workflow diagrams for the 10 enriched solutions in the catalog.
// Lifted verbatim from the 2026 Solutions Atlas mock; rendered lazily by the
// SolutionModal Workflow tab.

export const RICH_MERMAID: Record<string, string> = {
    'c-commercial-ppm': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'secondaryColor': '#006100', 'tertiaryColor': '#3B0B37', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph PRECON["🏗 PRECONSTRUCTION - PHASE 1"]
    direction TB
    BID["Bid Management<br/>• Bid invitations<br/>• Sub outreach<br/>• Bid leveling<br/>• Award decision"]
    EST["Estimating<br/>• Assemblies<br/>• Markup engine<br/>• Baseline budget<br/>• Cost code map"]
    CONTRACT["Contracts<br/>• Owner contract<br/>• Sub contracts<br/>• Insurance / bonds<br/>• Schedule of values"]
  end
  subgraph BUILD["🔨 PROJECT DELIVERY - PHASE 1"]
    direction TB
    SCHED["Schedule & Gantt<br/>• Master schedule<br/>• Look-ahead<br/>• Milestones<br/>• Critical path"]
    FIELD["Field Operations<br/>• Daily logs<br/>• Photos<br/>• Safety<br/>• Manpower"]
    RFI["RFIs & Submittals<br/>• RFI log<br/>• Routing<br/>• Submittal register<br/>• Response SLA"]
    CO["Change Orders<br/>• PCO tracker<br/>• Pricing<br/>• Owner approval<br/>• Budget impact"]
  end
  subgraph FIN["💰 FINANCE - PHASE 2"]
    direction TB
    AIA["AIA Billing<br/>• G702/G703<br/>• Retainage<br/>• Pay apps<br/>• Lien waivers"]
    COST["Cost Control<br/>• Committed costs<br/>• Actuals<br/>• Forecast to complete<br/>• Variance"]
    CLOSE["Closeout<br/>• Punch list<br/>• O&M manuals<br/>• Warranties<br/>• Final billing"]
  end
  subgraph DASH["📊 DASHBOARDS - PHASE 2"]
    direction TB
    EXEC["Executive<br/>• Portfolio P&L<br/>• Cash position<br/>• Backlog<br/>• Risk heatmap"]
    PM_DASH["PM View<br/>• Schedule health<br/>• Open RFIs<br/>• Change order status<br/>• Field logs"]
  end
  A1["🤖 Auto-route RFI to design team"]:::automation
  A2["🤖 PCO → budget variance alert"]:::automation
  A3["🤖 Weekly field log reminder"]:::automation
  A4["🤖 Pay app → accounting sync"]:::automation
  BID --> EST --> CONTRACT --> SCHED
  SCHED --> FIELD
  FIELD --> A3
  FIELD --> RFI --> A1
  RFI --> CO --> A2
  A2 --> COST
  CONTRACT --> AIA --> A4
  AIA --> COST --> CLOSE
  COST -.-> PM_DASH
  CLOSE -.-> EXEC
  FIELD -.-> PM_DASH
  class PRECON,BUILD phase1
  class FIN,DASH phase2
  class EXEC,PM_DASH reporting
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["Procore"]:::board
    I2["QuickBooks"]:::board
    I3["DocuSign"]:::board
    I4["Gmail / Outlook"]:::board
    I5["Bluebeam"]:::board
  end
  subgraph TEAM["👥 TEAM (12-25 seats)"]
    direction LR
    T1["Executives<br/>• VP Ops<br/>• CFO"]:::board
    T2["PM Team<br/>• Senior PMs<br/>• APMs"]:::board
    T3["Field<br/>• Superintendents<br/>• Foremen"]:::board
    T4["Finance<br/>• Controller<br/>• Billing"]:::board
  end`,

    'c-residential-hv': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph LAND["🏡 LAND & SALES - PHASE 1"]
    direction TB
    LOT["Lot Inventory<br/>• Community<br/>• Plan type<br/>• Status<br/>• Release date"]
    SALES["Home Sales<br/>• Buyer profile<br/>• Options/upgrades<br/>• Financing<br/>• Earnest money"]
    PERMIT["Permitting<br/>• Submittal<br/>• Plan check<br/>• Approvals<br/>• Fees"]
  end
  subgraph PROD["🔨 PRODUCTION - PHASE 1"]
    direction TB
    FOUND["Foundation<br/>• Dig & pour<br/>• Inspection<br/>• Underground MEP"]
    FRAME["Framing & Dry-in<br/>• Framing<br/>• Roof<br/>• Windows<br/>• Inspections"]
    MEP["MEP Rough<br/>• Plumbing<br/>• Electrical<br/>• HVAC<br/>• Inspections"]
    FIN1["Finish<br/>• Drywall<br/>• Cabinets<br/>• Flooring<br/>• Paint"]
  end
  subgraph QC["✅ QC & CLOSE - PHASE 2"]
    direction TB
    WALK["Buyer Walkthrough<br/>• Orientation<br/>• Punch list<br/>• Sign-off"]
    PUNCH["Punch Completion<br/>• Trade recalls<br/>• Photo confirm<br/>• Re-walk"]
    CLOSE["Closing<br/>• Final inspection<br/>• CO issued<br/>• Key delivery"]
  end
  subgraph DASH["📊 DASHBOARDS - PHASE 2"]
    direction TB
    CYCLE["Cycle Time<br/>• Per plan type<br/>• Per community<br/>• Delay reasons"]
    TRADE["Trade Performance<br/>• Scorecards<br/>• Defect rate<br/>• Recall count"]
  end
  A1["🤖 Lot released → start foundation checklist"]:::automation
  A2["🤖 Inspection pass → unlock next trade"]:::automation
  A3["🤖 Punch item → auto-notify trade"]:::automation
  A4["🤖 Close 30 days out → buyer email sequence"]:::automation
  LOT --> SALES --> PERMIT
  PERMIT --> A1 --> FOUND
  FOUND --> A2 --> FRAME --> A2 --> MEP --> A2 --> FIN1
  FIN1 --> WALK --> PUNCH --> A3
  A3 --> CLOSE
  CLOSE --> A4
  FOUND -.-> CYCLE
  FRAME -.-> CYCLE
  PUNCH -.-> TRADE
  class LAND,PROD phase1
  class QC,DASH phase2
  class CYCLE,TRADE reporting
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["Procore"]:::board
    I2["Sales Simplicity"]:::board
    I3["BuilderTrend"]:::board
    I4["QuickBooks"]:::board
  end
  subgraph TEAM["👥 TEAM (15-40 seats)"]
    direction LR
    T1["Land / Sales<br/>• Division Pres<br/>• Sales"]:::board
    T2["Purchasing<br/>• Estimators<br/>• Buyers"]:::board
    T3["Production<br/>• Super<br/>• Asst. Super"]:::board
    T4["Warranty<br/>• Warranty Mgr"]:::board
  end`,

    'trades': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph SALES["📋 SALES & QUOTING - PHASE 1"]
    direction TB
    LEAD["Lead Intake<br/>• Inbound call<br/>• Web form<br/>• Referral<br/>• Recurring client"]
    SITE["Site Visit<br/>• Scope of work<br/>• Photos<br/>• Measurements"]
    QUOTE["Quote Build<br/>• Labor + materials<br/>• Assemblies<br/>• Margin check<br/>• Send"]
  end
  subgraph OPS["🔧 FIELD OPS - PHASE 1"]
    direction TB
    SCHED["Crew Schedule<br/>• Calendar view<br/>• Crew capacity<br/>• Route plan"]
    DISPATCH["Dispatch<br/>• Work order<br/>• Mobile push<br/>• Arrival ETA"]
    ONSITE["Onsite<br/>• Clock in/out<br/>• Photos<br/>• Materials used<br/>• Customer sig"]
  end
  subgraph FIN["💰 JOB COST & BILLING - PHASE 2"]
    direction TB
    COST["Job Cost<br/>• Labor hours<br/>• Materials<br/>• Subs<br/>• Margin real-time"]
    INV["Invoice<br/>• Auto-generate<br/>• Progress or T&M<br/>• Email to client"]
    COLLECT["Collections<br/>• Aging<br/>• Reminders<br/>• Payment"]
  end
  subgraph DASH["📊 DASHBOARDS - PHASE 2"]
    direction TB
    TECH["Tech Performance<br/>• Revenue per tech<br/>• Close rate<br/>• Upsell"]
    SVC["Service SLA<br/>• Response time<br/>• First-time fix<br/>• NPS"]
  end
  A1["🤖 Quote sent → 2-day follow-up"]:::automation
  A2["🤖 Scheduled → SMS crew and customer"]:::automation
  A3["🤖 Onsite complete → invoice draft"]:::automation
  A4["🤖 Invoice unpaid → reminder ladder"]:::automation
  LEAD --> SITE --> QUOTE --> A1
  A1 --> SCHED --> A2 --> DISPATCH --> ONSITE
  ONSITE --> A3 --> COST
  COST --> INV --> A4 --> COLLECT
  ONSITE -.-> TECH
  DISPATCH -.-> SVC
  COLLECT -.-> SVC
  class SALES,OPS phase1
  class FIN,DASH phase2
  class TECH,SVC reporting
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["ServiceTitan"]:::board
    I2["QuickBooks"]:::board
    I3["OpenPhone"]:::board
    I4["Google Maps"]:::board
    I5["DocuSign"]:::board
  end
  subgraph TEAM["👥 TEAM (20-60 seats)"]
    direction LR
    T1["Office<br/>• Dispatch<br/>• CSRs"]:::board
    T2["Sales<br/>• Estimators"]:::board
    T3["Field<br/>• Techs<br/>• Foremen"]:::board
    T4["Finance<br/>• Billing<br/>• AR"]:::board
  end`,

    'mfg-build-tracker': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph SO["📝 SALES ORDER - PHASE 1"]
    direction TB
    CRM["CRM Hand-off<br/>• Deal won<br/>• Spec sheet<br/>• Required date"]
    CONFIG["Configuration<br/>• CTO options<br/>• Engineering review<br/>• Final spec"]
    BOM["BOM Generation<br/>• Parts<br/>• Assemblies<br/>• Sub-assemblies"]
  end
  subgraph PROC["📦 PROCUREMENT - PHASE 1"]
    direction TB
    POB["PO Board<br/>• Supplier<br/>• Lead time<br/>• Expected date<br/>• Cost"]
    REC["Receiving<br/>• PO match<br/>• QC on receipt<br/>• Shortages"]
    INV["Raw Inventory<br/>• On hand<br/>• Allocated<br/>• Reorder point"]
  end
  subgraph PROD["🏭 PRODUCTION - PHASE 1"]
    direction TB
    SEQ["Build Sequence<br/>• Work orders<br/>• Station<br/>• Operator<br/>• Hours"]
    QC["QC Gates<br/>• In-process<br/>• Final<br/>• NCR log"]
    SHIP["Shipping<br/>• Pack<br/>• Carrier<br/>• BOL<br/>• Tracking"]
  end
  subgraph DASH["📊 DASHBOARDS - PHASE 2"]
    direction TB
    OTD["On-Time Delivery<br/>• Promised vs actual<br/>• Schedule slip reasons"]
    MARGIN["Build Margin<br/>• Actual cost vs quote<br/>• Labor variance"]
    QUAL["Quality<br/>• First-pass yield<br/>• Defect rate"]
  end
  A1["🤖 Spec locked → BOM generate"]:::automation
  A2["🤖 BOM → PO drafts for each supplier"]:::automation
  A3["🤖 All parts received → release work order"]:::automation
  A4["🤖 Final QC pass → trigger ship"]:::automation
  CRM --> CONFIG --> A1 --> BOM --> A2 --> POB
  POB --> REC --> INV --> A3 --> SEQ
  SEQ --> QC --> A4 --> SHIP
  SHIP -.-> OTD
  SEQ -.-> MARGIN
  QC -.-> QUAL
  class SO,PROC,PROD phase1
  class DASH phase2
  class OTD,MARGIN,QUAL reporting
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["NetSuite"]:::board
    I2["SolidWorks PDM"]:::board
    I3["Apollo"]:::board
    I4["Shippo"]:::board
  end
  subgraph TEAM["👥 TEAM (15-50 seats)"]
    direction LR
    T1["Sales Ops<br/>• CSRs"]:::board
    T2["Engineering<br/>• Design<br/>• CAD"]:::board
    T3["Operations<br/>• Planners<br/>• Leads"]:::board
    T4["Shop Floor<br/>• Operators<br/>• QC"]:::board
  end`,

    'erp-production': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph DEM["📈 DEMAND - PHASE 1"]
    direction TB
    SO["Sales Orders<br/>• From CRM<br/>• EDI<br/>• Web store"]
    FC["Forecast<br/>• By SKU<br/>• By customer<br/>• Seasonality"]
  end
  subgraph SC["🚚 SUPPLY CHAIN - PHASE 1"]
    direction TB
    MRP["MRP Lite<br/>• Gross requirements<br/>• Available inventory<br/>• Net demand"]
    PO["Purchase Orders<br/>• Vendor<br/>• Lead time<br/>• Expected delivery"]
    REC["Receive &amp; Putaway<br/>• PO match<br/>• Bin locations<br/>• Cycle counts"]
  end
  subgraph OPS["🏭 PRODUCTION - PHASE 1"]
    direction TB
    WORK["Work Orders<br/>• Routings<br/>• Labor plan<br/>• Materials plan"]
    FLOOR["Shop Floor<br/>• Clock in/out<br/>• Scrap<br/>• Yield"]
    FG["Finished Goods<br/>• Completion<br/>• Location<br/>• Hold status"]
  end
  subgraph FUL["📦 FULFILLMENT - PHASE 2"]
    direction TB
    PICK["Pick & Pack<br/>• Wave<br/>• Pack list<br/>• Carton"]
    SHIP["Ship<br/>• Carrier<br/>• BOL<br/>• Tracking"]
    INV["Invoice<br/>• Auto-generate<br/>• AR post"]
  end
  subgraph FIN["💰 FINANCE - PHASE 2"]
    direction TB
    GL["GL Sync<br/>• NetSuite or QBO<br/>• Daily sync<br/>• Reconciliation"]
    COGS["COGS Roll-up<br/>• By job<br/>• By product<br/>• By customer"]
  end
  A1["🤖 SO → MRP run"]:::automation
  A2["🤖 Low stock → auto-draft PO"]:::automation
  A3["🤖 WO complete → move to FG"]:::automation
  A4["🤖 Ship confirm → invoice trigger"]:::automation
  SO --> A1 --> MRP
  FC --> MRP --> A2 --> PO --> REC
  MRP --> WORK --> FLOOR --> A3 --> FG --> PICK --> SHIP --> A4 --> INV
  INV --> GL
  FLOOR --> COGS
  class DEM,SC,OPS phase1
  class FUL,FIN phase2
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["NetSuite"]:::board
    I2["QuickBooks"]:::board
    I3["ShipStation"]:::board
    I4["Shopify"]:::board
    I5["EDI (SPS)"]:::board
  end
  subgraph TEAM["👥 TEAM (10-30 seats)"]
    direction LR
    T1["Sales Ops"]:::board
    T2["Planners"]:::board
    T3["Shop Floor"]:::board
    T4["Finance"]:::board
  end`,

    'dream-crm': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph INTAKE["📥 PIPELINE - PHASE 1"]
    direction TB
    LEAD["Lead Board<br/>• Source (Apollo, web, referral)<br/>• Scoring<br/>• SLA to first touch"]
    QUAL["Qualification<br/>• BANT or MEDDIC<br/>• Disqualify reasons<br/>• Nurture fallback"]
    OPP["Opportunities<br/>• Stage<br/>• Amount<br/>• Close date<br/>• Products"]
  end
  subgraph EXEC["📣 SALES EXECUTION - PHASE 1"]
    direction TB
    SEQ["Cadence<br/>• Email/call/LI<br/>• Touch log<br/>• Owner rotation"]
    PROP["Proposals<br/>• Template<br/>• Pricing<br/>• DocuSign"]
    NEG["Negotiation<br/>• Redlines<br/>• Approvals<br/>• Signed date"]
  end
  subgraph POST["🤝 POST-SALE - PHASE 2"]
    direction TB
    HANDOFF["CS Handoff<br/>• Kickoff ticket<br/>• Account record<br/>• Scope confirm"]
    ACCT["Accounts<br/>• Hierarchy<br/>• Whitespace<br/>• Renewal date"]
    GROW["Expand<br/>• QBR<br/>• Upsell flags<br/>• Reference asks"]
  end
  subgraph DASH["📊 REPORTING - PHASE 2"]
    direction TB
    FCST["Forecast<br/>• Weighted pipe<br/>• Rep commit<br/>• Slip analysis"]
    ACT["Activity<br/>• Touches per rep<br/>• Calls/demos<br/>• Outcomes"]
    CLV["Customer LTV<br/>• Cohort revenue<br/>• Churn flags"]
  end
  A1["🤖 Lead enters → assign round-robin"]:::automation
  A2["🤖 Stage change → tasks update"]:::automation
  A3["🤖 Closed-won → handoff ticket"]:::automation
  A4["🤖 Renewal 90-day → owner alert"]:::automation
  LEAD --> A1 --> QUAL --> OPP
  OPP --> A2 --> SEQ --> PROP --> NEG
  NEG --> A3 --> HANDOFF --> ACCT --> A4 --> GROW
  OPP -.-> FCST
  SEQ -.-> ACT
  ACCT -.-> CLV
  class INTAKE,EXEC phase1
  class POST,DASH phase2
  class FCST,ACT,CLV reporting
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["Apollo"]:::board
    I2["Gmail / Outlook"]:::board
    I3["Google Calendar"]:::board
    I4["OpenPhone"]:::board
    I5["DocuSign"]:::board
    I6["Slack"]:::board
  end
  subgraph TEAM["👥 TEAM (5-50 seats)"]
    direction LR
    T1["SDR/BDR"]:::board
    T2["Account Exec"]:::board
    T3["Sales Mgr"]:::board
    T4["RevOps"]:::board
    T5["CS / AM"]:::board
  end`,

    're-resi': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph LEADS["🏠 LEADS - PHASE 1"]
    direction TB
    L1["Lead Sources<br/>• Zillow<br/>• Referral<br/>• Sphere<br/>• Walk-in"]
    L2["Lead Nurture<br/>• Drip email<br/>• Auto-DM<br/>• Event invites"]
    L3["Qualified Buyer<br/>• Pre-approval<br/>• Needs<br/>• Timeline"]
  end
  subgraph SHOW["🔑 SHOWINGS - PHASE 1"]
    direction TB
    LIST["Listing Match<br/>• Saved searches<br/>• Auto-alerts"]
    TOUR["Showings<br/>• Calendar invite<br/>• Feedback form<br/>• Follow-up"]
    OFFER["Offer<br/>• Terms<br/>• Escalation<br/>• Contingencies"]
  end
  subgraph TC["📝 TRANSACTION COORDINATION - PHASE 2"]
    direction TB
    UC["Under Contract<br/>• Key dates<br/>• Tasks<br/>• Docs"]
    INSP["Inspection &amp; Appraisal<br/>• Scheduling<br/>• Reports<br/>• Negotiation"]
    CL["Closing<br/>• Title<br/>• Walkthrough<br/>• Wire confirm"]
  end
  subgraph NURT["💌 NURTURE - PHASE 2"]
    direction TB
    POST["Post-Close<br/>• Anniversary<br/>• Home tips<br/>• Referral asks"]
    SPHERE["Sphere Marketing<br/>• Monthly touch<br/>• Event invites"]
  end
  A1["🤖 New lead → assign to agent"]:::automation
  A2["🤖 Showing booked → reminder + feedback"]:::automation
  A3["🤖 Under contract → TC checklist"]:::automation
  A4["🤖 Anniversary → send card"]:::automation
  L1 --> A1 --> L2 --> L3
  L3 --> LIST --> TOUR --> A2 --> OFFER
  OFFER --> A3 --> UC --> INSP --> CL
  CL --> POST --> A4
  POST --> SPHERE
  class LEADS,SHOW phase1
  class TC,NURT phase2
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["MLS"]:::board
    I2["DocuSign"]:::board
    I3["Gmail"]:::board
    I4["BombBomb"]:::board
  end
  subgraph TEAM["👥 TEAM (3-20 seats)"]
    direction LR
    T1["Agents"]:::board
    T2["Transaction Coord."]:::board
    T3["Team Leader"]:::board
    T4["Marketing"]:::board
  end`,

    'ppm-general': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph DEM["🧭 DEMAND - PHASE 1"]
    direction TB
    INT1["Intake Form<br/>• Business case<br/>• Sponsor<br/>• Requested date"]
    PRIO["Prioritization<br/>• Scoring<br/>• Governance<br/>• Rolling backlog"]
    CHART["Charter<br/>• Scope<br/>• Team<br/>• Budget<br/>• Deliverables"]
  end
  subgraph EXEC["⚙️ EXECUTION - PHASE 1"]
    direction TB
    PLAN["Project Plan<br/>• Milestones<br/>• Tasks<br/>• Dependencies"]
    RES["Resourcing<br/>• Assignments<br/>• Capacity<br/>• Utilization"]
    STATUS["Status<br/>• Weekly update<br/>• RAG flags<br/>• Decisions"]
  end
  subgraph RISK["⚠️ RISK & CHANGE - PHASE 1"]
    direction TB
    RSK["Risks<br/>• Register<br/>• Probability<br/>• Impact<br/>• Mitigation"]
    CR["Change Requests<br/>• Log<br/>• Approval<br/>• Baseline update"]
  end
  subgraph REP["📊 PORTFOLIO - PHASE 2"]
    direction TB
    EXECV["Executive View<br/>• Portfolio health<br/>• Budget vs actual<br/>• Benefits tracking"]
    TIME["Utilization<br/>• Team load<br/>• Billable %<br/>• WIP"]
  end
  A1["🤖 Intake submitted → scoring workflow"]:::automation
  A2["🤖 Red status → exec alert"]:::automation
  A3["🤖 CR approved → plan update"]:::automation
  INT1 --> A1 --> PRIO --> CHART --> PLAN --> RES --> STATUS
  STATUS --> A2
  STATUS --> RSK --> CR --> A3 --> PLAN
  STATUS -.-> EXECV
  RES -.-> TIME
  class DEM,EXEC,RISK phase1
  class REP phase2
  class EXECV,TIME reporting
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["Gmail / Outlook"]:::board
    I2["Slack"]:::board
    I3["Jira"]:::board
    I4["Harvest"]:::board
  end
  subgraph TEAM["👥 TEAM (10-80 seats)"]
    direction LR
    T1["PMO Leader"]:::board
    T2["PMs"]:::board
    T3["Delivery Teams"]:::board
    T4["Execs"]:::board
  end`,

    'pool-construction': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph CRM["🔷 CRM - PHASE 1"]
    direction TB
    LI["Lead Intake<br/>• FB / IG<br/>• Google Ads<br/>• Website<br/>• Referrals"]
    CP["Client Profile<br/>• Contact<br/>• Address<br/>• Budget<br/>• Project type"]
    M["Measurements<br/>• Site visit<br/>• Notes<br/>• Photos"]
    Q["Quote<br/>• Materials<br/>• Labor<br/>• Designer approval"]
  end
  subgraph DES["📐 DESIGN - PHASE 1"]
    direction TB
    R["3D Renders<br/>• Render request<br/>• Visual presentation"]
    SR["Showroom Meeting<br/>• Present<br/>• Revisions<br/>• Decision"]
    CT["Contract<br/>• Signed<br/>• Deposit<br/>• Portal created"]
  end
  subgraph PM["🔨 PROJECT MGMT - PHASE 1"]
    direction TB
    HO["PM Handoff<br/>• Final measurements<br/>• AutoCAD plans"]
    CAL["Project Calendar<br/>• Trades<br/>• Material deliveries<br/>• Payment milestones"]
    EXEC["Execution<br/>• Daily tasks<br/>• Photos<br/>• Issue log"]
  end
  subgraph PU["📦 PURCHASING - PHASE 1"]
    direction TB
    PO["Purchase Orders<br/>• Supplier<br/>• Expected date"]
    TR["Delivery Tracking<br/>• Status<br/>• Location<br/>• Issues"]
    PL["Punch List<br/>• Photos<br/>• Assignment<br/>• Completion"]
  end
  subgraph FI["💰 FINANCE - PHASE 2"]
    direction TB
    IV["Invoicing<br/>• Payment schedule<br/>• Reminders<br/>• DocuSign"]
    BG["Budget Tracking<br/>• Variance<br/>• Margin<br/>• Live updates"]
    AC["Accounting Sync<br/>• QBO or Avantage<br/>• Cost recognition"]
  end
  subgraph DB["📊 DASHBOARDS - PHASE 2"]
    direction TB
    SD["Sales<br/>• Lead conversion<br/>• Quote status<br/>• Pipeline"]
    PD["Projects<br/>• Active<br/>• Timeline<br/>• Delays"]
    FD["Finance<br/>• Cash flow<br/>• P&amp;L<br/>• Profitability"]
  end
  subgraph CL["👥 CLIENT PORTAL - PHASE 2"]
    direction TB
    PO2["Portal<br/>• Schedule<br/>• Photos<br/>• Change orders<br/>• Invoices"]
    CO["Communication<br/>• Messages<br/>• Approvals"]
  end
  subgraph NU["💌 NURTURE - PHASE 2"]
    direction TB
    FU["Post-Project<br/>• Newsletter<br/>• Holidays<br/>• 6-month check"]
  end
  A1["🤖 Client profile + portal"]:::automation
  A2["🤖 3D render request"]:::automation
  A3["🤖 Payment reminders"]:::automation
  A4["🤖 Trade calendar invites"]:::automation
  A5["🤖 Delivery notifications"]:::automation
  A6["🤖 Client updates"]:::automation
  A7["🤖 Nurture campaigns"]:::automation
  LI --> CP --> A1 --> M --> Q --> A2 --> R --> SR --> CT
  CT --> A3
  CT --> HO --> CAL --> A4 --> PO --> TR --> A5
  CAL --> EXEC --> PL --> A6 --> PO2 --> CO
  CT --> IV --> BG --> AC
  EXEC --> PD
  Q --> SD
  AC --> FD
  PL --> FU --> A7
  LI -.-> SD
  CAL -.-> PD
  BG -.-> FD
  class CRM,DES,PM,PU phase1
  class FI,DB,CL,NU phase2
  class SD,PD,FD reporting
  subgraph IN["🔗 INTEGRATIONS"]
    direction LR
    I1["Google Calendar"]:::board
    I2["DocuSign"]:::board
    I3["Avantage SMV"]:::board
    I4["Gmail / Outlook"]:::board
    I5["WhatsApp"]:::board
    I6["OpenPhone"]:::board
  end
  subgraph TM["👥 TEAM (12-15 seats)"]
    direction LR
    T1["Design Team"]:::board
    T2["PM Team"]:::board
    T3["Field Team"]:::board
    T4["Support"]:::board
  end`,

    'cs-ticketing': `%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3E50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#7c3aed', 'lineColor': '#c026d3', 'background': '#0f0a24', 'mainBkg': '#2D3E50', 'fontFamily': 'Poppins, sans-serif'}}}%%
flowchart TB
  classDef board fill:#2D3E50,stroke:#fff,stroke-width:2px,color:#fff
  classDef automation fill:#532657,stroke:#fff,stroke-width:2px,color:#fff,stroke-dasharray: 5 5
  classDef reporting fill:#006100,stroke:#fff,stroke-width:2px,color:#fff
  classDef phase1 fill:#1E90FF,stroke:#fff,stroke-width:3px,color:#fff
  classDef phase2 fill:#c026d3,stroke:#fff,stroke-width:3px,color:#fff
  subgraph IN["📥 INTAKE - PHASE 1"]
    direction TB
    EMAIL["Email<br/>• support@<br/>• Auto-parse"]
    WEB["Web Form<br/>• Category<br/>• Severity<br/>• Attachments"]
    PHONE["Phone / Chat<br/>• OpenPhone<br/>• Live agent"]
    COMM["Omnichannel Queue<br/>• Unified inbox<br/>• Deduping"]
  end
  subgraph TRI["🎯 TRIAGE - PHASE 1"]
    direction TB
    CLASS["Classify<br/>• Product area<br/>• Severity<br/>• Customer tier"]
    ASSIGN["Assignment<br/>• Team queue<br/>• Round-robin<br/>• Skill match"]
    SLA["SLA Clock<br/>• Response<br/>• Resolution<br/>• Breach alerts"]
  end
  subgraph RES["🔧 RESOLUTION - PHASE 1"]
    direction TB
    WORK["Work Ticket<br/>• Notes<br/>• Updates<br/>• Internal threads"]
    KB["Knowledge Base<br/>• Suggested articles<br/>• Draft replies"]
    ESC["Escalation<br/>• Tier 2 / 3<br/>• Engineering<br/>• Leadership"]
    CLOSE["Close<br/>• Resolution code<br/>• CSAT<br/>• Reopen window"]
  end
  subgraph DASH["📊 REPORTING - PHASE 2"]
    direction TB
    SLA2["SLA Health<br/>• % on-time<br/>• Breaches"]
    AGENT["Agent Perf<br/>• Tickets/agent<br/>• First-time-fix<br/>• CSAT"]
    TREND["Issue Trends<br/>• Top categories<br/>• Product hotspots"]
  end
  A1["🤖 New ticket → classify + assign"]:::automation
  A2["🤖 Near SLA breach → escalate"]:::automation
  A3["🤖 KB match → suggest reply"]:::automation
  A4["🤖 Closed → CSAT survey"]:::automation
  EMAIL --> COMM
  WEB --> COMM
  PHONE --> COMM
  COMM --> A1 --> CLASS --> ASSIGN --> SLA
  SLA --> WORK
  WORK --> A3 --> KB
  SLA --> A2 --> ESC --> WORK
  WORK --> CLOSE --> A4
  SLA --> SLA2
  WORK --> AGENT
  CLASS --> TREND
  class IN,TRI,RES phase1
  class DASH phase2
  class SLA2,AGENT,TREND reporting
  subgraph INT["🔗 INTEGRATIONS"]
    direction LR
    I1["Gmail / Outlook"]:::board
    I2["Slack"]:::board
    I3["OpenPhone"]:::board
    I4["Intercom"]:::board
    I5["Jira"]:::board
  end
  subgraph TEAM["👥 TEAM (8-60 seats)"]
    direction LR
    T1["Tier 1 Agents"]:::board
    T2["Tier 2 Specialists"]:::board
    T3["Supervisors"]:::board
    T4["KB Editors"]:::board
  end`
}
