export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'contactEmail', title: 'Contact Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'calendlyLink', title: 'Calendly Link', type: 'string' },

    // Default site-wide SEO (root <title> + <meta description>, used by
    // any page that doesn't override).
    { name: 'defaultSeoTitle', title: 'Default SEO Title', type: 'string' },
    { name: 'defaultSeoDescription', title: 'Default SEO Description', type: 'text' },

    // Names of former teammates whose Sanity docs should not render
    // publicly. Compared case-insensitively. Lets editors hide an alum
    // without deleting their record.
    {
      name: 'excludedTeamMemberNames',
      title: 'Excluded Team Member Names',
      type: 'array',
      of: [{ type: 'string' }],
    },

    // Reusable button labels
    { name: 'navbarCtaLabel', title: 'Navbar CTA Label', type: 'string' },
    { name: 'footerCtaLabel', title: 'Footer CTA Label', type: 'string' },

    // Footer column headings
    { name: 'footerPartnerExpertiseHeading', title: 'Footer Heading: Partner Expertise', type: 'string' },
    { name: 'footerServicesHeading', title: 'Footer Heading: Services', type: 'string' },
    { name: 'footerDepartmentSolutionsHeading', title: 'Footer Heading: Department Solutions', type: 'string' },
    { name: 'footerIndustrySolutionsHeading', title: 'Footer Heading: Industry Solutions', type: 'string' },
    { name: 'footerOurLocationsHeading', title: 'Footer Heading: Our Locations', type: 'string' },

    // Footer privacy/terms links
    {
      name: 'footerLegalLinks',
      title: 'Footer Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Href', type: 'string' },
          ],
        },
      ],
    },

    // Footer copyright text
    { name: 'footerCopyrightText', title: 'Footer Copyright Text', type: 'string' },
    { name: 'mondayAffiliateLink', title: 'Monday Affiliate Link', type: 'string' },
    { name: 'logo', title: 'Logo (color)', type: 'image' },
    { name: 'logoWhite', title: 'Logo (white, for dark bg)', type: 'image' },
    { name: 'logoRound', title: 'Logo (round mark)', type: 'image' },
    { name: 'footerText', title: 'Footer Text', type: 'text' },

    // Navigation — top-level items with sections and links
    {
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            {
              name: 'href',
              title: 'Direct link (optional)',
              type: 'string',
              description:
                'If set and the item has no sections, this tab is a plain link (e.g. Contact) instead of a dropdown.',
            },
            {
              name: 'layout',
              title: 'Dropdown layout',
              type: 'string',
              options: { list: ['stacked', 'columns'] },
              description:
                '"stacked": sections stack vertically, items in a 3-col grid (legacy default). "columns": sections render as side-by-side mega-menu columns.',
            },
            {
              name: 'sections',
              title: 'Sections',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navSection',
                  fields: [
                    { name: 'heading', title: 'Heading', type: 'string' },
                    {
                      name: 'columns',
                      title: 'Item columns',
                      type: 'number',
                      description: 'Grid columns for items inside this section. Defaults: 3 (stacked layout) / 1 (columns layout).',
                    },
                    {
                      name: 'highlight',
                      title: 'Highlight section',
                      type: 'boolean',
                      description: 'Visually dominant column (tinted panel) — e.g. monday.com in the Platforms menu.',
                    },
                    {
                      name: 'badge',
                      title: 'Badge',
                      type: 'string',
                      description: 'Small pill rendered next to the heading, e.g. "Platinum Partner".',
                    },
                    {
                      name: 'items',
                      title: 'Items',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          name: 'navLink',
                          fields: [
                            { name: 'label', title: 'Label', type: 'string' },
                            { name: 'href', title: 'Href', type: 'string' },
                            { name: 'description', title: 'Description', type: 'string' },
                            {
                              name: 'featured',
                              title: 'Featured',
                              type: 'boolean',
                              description: 'Emphasised card styling within its column.',
                            },
                            {
                              name: 'icon',
                              title: 'Icon (key)',
                              type: 'string',
                              description: 'Icon key — see Navbar nav-icons set',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // Navbar partner badges
    {
      name: 'navbarPartnerBadges',
      title: 'Navbar Partner Badges',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'partnerBadge',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'image', title: 'Image', type: 'image' },
            { name: 'width', title: 'Width', type: 'number' },
            { name: 'height', title: 'Height', type: 'number' },
          ],
        },
      ],
    },

    // Footer partner expertise logos
    {
      name: 'footerPartnerLogos',
      title: 'Footer Partner Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerPartnerLogo',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'image', title: 'Image', type: 'image' },
            { name: 'width', title: 'Width', type: 'number' },
            { name: 'height', title: 'Height', type: 'number' },
          ],
        },
      ],
    },

    // Social links
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'URL', type: 'string' },
            { name: 'icon', title: 'Icon', type: 'image' },
          ],
        },
      ],
    },

    // Office locations
    {
      name: 'offices',
      title: 'Offices',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'office',
          fields: [
            { name: 'flag', title: 'Flag Emoji', type: 'string' },
            { name: 'city', title: 'City', type: 'string' },
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Href', type: 'string' },
            { name: 'address', title: 'Address', type: 'string' },
            { name: 'addressUrl', title: 'Address URL', type: 'url' },
            { name: 'phone', title: 'Phone', type: 'string' },
            { name: 'phoneTel', title: 'Phone (tel format)', type: 'string' },
          ],
        },
      ],
    },

    // Footer column links
    {
      name: 'footerServicesLinks',
      title: 'Footer Services Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Href', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'footerDepartmentLinks',
      title: 'Footer Department Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Href', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'footerIndustryLinks',
      title: 'Footer Industry Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'link',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'Href', type: 'string' },
          ],
        },
      ],
    },

    // Shared reusable content across pages
    {
      name: 'carouselLogos',
      title: 'Client Carousel Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'clientLogo',
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'image', title: 'Image', type: 'image' },
          ],
        },
      ],
    },

    // Certification / security / ROI badges used across pages
    { name: 'badgeCertifications', title: 'Badge: Certifications', type: 'image' },
    { name: 'badgeSecurity', title: 'Badge: Security', type: 'image' },
    { name: 'badgeForrester', title: 'Badge: Forrester', type: 'image' },
    { name: 'badgeMondayPartners', title: 'Badge: monday Partners', type: 'image' },
  ],
}
