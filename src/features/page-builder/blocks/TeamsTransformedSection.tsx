'use client'

import { useState } from 'react'
import NumberedStepList from '@/components/common/NumberedStepList'

const tabs = [
  {
    label: 'Top Leadership Challenges',
    items: [
      {
        title: 'Financial Uncertainty',
        description:
          'Improving reporting visibility of business performance to make better decisions and to quickly correct course on strategic initiatives.',
      },
      {
        title: 'AI & Automation',
        description:
          'Team enablement and implementation of AI & Automation technologies to improve workforce efficiency and unlock hidden inefficiencies',
      },
      {
        title: 'Hybrid Work Management',
        description:
          'Optimising productivity and culture across distributed teams while maintaining operational excellence',
      },
      {
        title: 'Talent Retention & Personal Development',
        description:
          'Attracting and keeping key talent in a competitive market while upskilling for future needs',
      },
      {
        title: 'Cybersecurity & Digital Risk',
        description:
          'Protecting against evolving threats while ensuring data privacy and regulatory compliance',
      },
    ],
  },
  {
    label: 'Top Team Challenges',
    items: [
      {
        title: 'Hybrid Collaboration',
        description:
          'Adopting the right tools to maintain effective teamwork, communication, and workload capacity',
      },
      {
        title: 'Digital Adaptation',
        description:
          'Get expert training support to rapidly learn new tools and technologies while maintaining productivity',
      },
      {
        title: 'Work-Life Integration',
        description:
          'Giving team members time back with an automated system that cuts out manual work',
      },
      {
        title: 'Personal Development',
        description:
          'Develop team members to learn how to optimise processes with better systems',
      },
      {
        title: 'Team Cohesion',
        description:
          'Unify the team with communication and work management systems',
      },
    ],
  },
  {
    label: 'How We Can Help',
    subheading:
      'Our expert consultants empower you to adopt workflow automation & AI systems',
    items: [
      {
        title: 'Process Discovery → Business Process Audit',
        description:
          'We meticulously map your existing workflows against industry benchmarks, analysing bottlenecks and efficiency gaps that hold your team back from scaling.',
      },
      {
        title: 'Technical Architecture → System Integration Scope',
        description:
          'Our technical assessment reveals the hidden potential in your current tech stack, identifying precise automated solution design to visualise where monday.com can transform fragmented processes into seamless workflows.',
      },
      {
        title: 'Solution Design → Implementation',
        description:
          'Through in-depth process analysis, we build your system with perfect balance between automated sophistication and user adoption, ensuring you see faster set up and team usage.',
      },
      {
        title: 'Efficiency Impact → ROI Opportunity Analysis',
        description:
          'By quantifying potential efficiency gains across your operations, we pinpoint exactly where automation and optimisation will deliver the highest return on your investment.',
      },
      {
        title: 'Change Readiness → Adoption & Training Strategies',
        description:
          'Our proven change impact framework measures organisational readiness and crafts a tailored adoption and training strategy, turning potential resistance into enthusiastic system adoption.',
      },
    ],
  },
]

export default function TeamsTransformedSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = tabs[activeIndex]

  return (
    <section className="bg-white py-[80px] px-4 relative overflow-hidden">
      {/* Decorative purple circle bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[200px] -right-[200px] w-[600px] h-[600px] opacity-40"
        style={{
          backgroundImage: "url(/images/bg-purple-circle.avif)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="relative mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
        {/* Heading + subheading */}
        <div className="flex flex-col gap-[12px] items-center text-center w-full">
          <h2 className="text-[35px] font-medium text-black leading-[49px]">
            Teams Transformed with Proven Efficiency Gains.
          </h2>
          <p className="text-[20px] text-black text-center">
            Authorised monday.com, Atlassian and make Consulting, implementation
            and integration partner consultants across Australia, UK, and US.
          </p>
        </div>

        {/* Tab pills + content card */}
        <div className="flex flex-col gap-[24px] items-center w-full max-w-[816px]">
          {/* Tab buttons */}
          <div className="flex justify-center gap-[12px] flex-wrap w-full">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-[99px] px-[31px] py-[7px] text-[16px] transition-all ${
                  i === activeIndex
                    ? 'bg-gradient-to-r from-[#8015e8] to-[#ba83f0] text-white shadow-[2.83px_2.83px_15px_3px_rgba(0,0,0,0.24)]'
                    : 'bg-white text-[#2b074d] border border-[#e8e6e6] hover:border-[#8015e8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Optional tab subheading */}
          {'subheading' in active && active.subheading && (
            <p className="text-[20px] text-black text-center">
              {active.subheading}
            </p>
          )}

          {/* Content card */}
          <NumberedStepList
            items={active.items.map((item, i) => ({
              _key: item.title,
              number: String(i + 1).padStart(2, '0'),
              title: item.title,
              description: item.description,
            }))}
            containerClassName="w-full rounded-card border border-[#e8e6e6] py-2 px-0"
            stepRowClassName="ui-step-row"
          />
        </div>
      </div>
    </section>
  )
}
