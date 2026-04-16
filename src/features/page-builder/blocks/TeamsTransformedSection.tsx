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
        title: 'Information Silos',
        description:
          'Breaking down barriers between departments so teams can collaborate effectively and share critical data in real time.',
      },
      {
        title: 'Manual Repetitive Tasks',
        description:
          'Eliminating time-consuming manual processes that drain productivity and increase the risk of human error.',
      },
      {
        title: 'Lack of Visibility',
        description:
          'Gaining a clear, centralised view of project progress, workloads, and team performance across the organisation.',
      },
      {
        title: 'Inefficient Communication',
        description:
          'Streamlining how teams communicate, reducing email overload and ensuring the right people get the right information.',
      },
      {
        title: 'Scaling Operations',
        description:
          'Building repeatable processes and workflows that grow with the team without adding complexity.',
      },
    ],
  },
  {
    label: 'How We Can Help',
    items: [
      {
        title: 'Consulting & Strategy',
        description:
          'Expert guidance to align your technology stack with business objectives and drive measurable outcomes.',
      },
      {
        title: 'Implementation & Migration',
        description:
          'End-to-end setup, configuration and migration to get your teams productive on monday.com from day one.',
      },
      {
        title: 'Integration & Automation',
        description:
          'Connecting your tools and automating workflows to eliminate manual work and create seamless data flow.',
      },
      {
        title: 'Training & Enablement',
        description:
          'Tailored training programs that empower your teams to get the most from their monday.com investment.',
      },
      {
        title: 'Ongoing Support & Optimisation',
        description:
          'Continuous improvement and dedicated support to ensure your workflows evolve as your business grows.',
      },
    ],
  },
]

export default function TeamsTransformedSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = tabs[activeIndex]

  return (
    <section className="bg-white py-[80px] px-4">
      <div className="mx-auto max-w-[959px] flex flex-col items-center gap-[40px]">
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
