// Static disclosure for B2B visitor identification (RB2B). Embedded on
// /data-privacy and /terms-and-conditions so we can update wording in code
// without an editor having to touch Sanity. Move to CMS later if marketing
// needs to edit this without a deploy.

const PRIVACY_EMAIL = "privacy@fruitionservices.com"

export default function VisitorTrackingDisclosure() {
  return (
    <section
      aria-labelledby="visitor-tracking-heading"
      className="prose prose-lg prose-gray max-w-none border-t border-gray-200 pt-12 mt-12"
    >
      <h2 id="visitor-tracking-heading">Visitor Identification &amp; Analytics</h2>

      <p>
        We use a B2B visitor identification service (<strong>RB2B</strong>,
        operated by Retention.com) to recognise business visitors to this
        website. RB2B matches anonymised device signals against publicly
        available business contact data so we can understand who is
        researching our services and follow up where appropriate. This
        service applies to visitors from every region we operate in,
        including the United States, the United Kingdom, the European
        Economic Area, and the rest of the world.
      </p>

      <h3>What we collect about you</h3>
      <ul>
        <li>
          <strong>Business identity</strong>: first name, last name, job
          title, business email, LinkedIn URL, and the employer associated
          with you in business directories.
        </li>
        <li>
          <strong>Company firmographics</strong>: company name, public
          website, industry, headcount range, estimated revenue, and
          approximate location (city, state/region, country).
        </li>
        <li>
          <strong>Visit context</strong>: the pages you viewed on this
          site, the referring URL (if any), and the timestamp of your
          visits. Repeat visits update existing records rather than
          creating duplicates.
        </li>
        <li>
          <strong>Company-only identification</strong>: where we can
          identify the company but not a specific individual, we record
          only the company and visit context.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> collect payment data, government
        identifiers, health information, or anything you have not
        published in a business context. RB2B does not place tracking
        cookies on your device; it relies on its own data graph.
      </p>

      <h3>Why we use it</h3>
      <p>
        We rely on our <strong>legitimate interests</strong> (Article
        6(1)(f) UK GDPR / EU GDPR) in:
      </p>
      <ul>
        <li>understanding which organisations engage with our content,</li>
        <li>
          contacting prospective business customers about services they
          appear to be researching, and
        </li>
        <li>improving how we present those services on this site.</li>
      </ul>
      <p>
        We have assessed that this processing is proportionate, limited
        to business contact data, and that you have a reasonable
        expectation of B2B outreach in this context.
      </p>

      <h3>Who receives this information</h3>
      <ul>
        <li>
          <strong>Retention.com (RB2B)</strong> — the identification
          provider, acting as a data controller for the source contact
          data and as a processor for our visit signals.
        </li>
        <li>
          <strong>monday.com</strong> — our CRM, where identified leads
          are stored.
        </li>
        <li>
          <strong>Slack Technologies</strong> — internal notifications
          to our sales team.
        </li>
      </ul>
      <p>
        We do not sell your data, and we do not transfer it outside the
        purposes described here.
      </p>

      <h3>Your rights and how to opt out</h3>
      <p>
        You can ask us at any time to access, correct, or delete the
        information we hold about you, or to stop processing it. To
        exercise any of these rights, email{" "}
        <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a> with the
        business email address or LinkedIn URL you would like us to
        action and we will respond within 30 days.
      </p>
      <p>
        To opt out of RB2B identification across every site that uses
        the service, submit a request directly to RB2B at{" "}
        <a
          href="https://www.rb2b.com/data-rights-request"
          target="_blank"
          rel="noopener noreferrer"
        >
          rb2b.com/data-rights-request
        </a>
        .
      </p>
      <p>
        If you are in the UK or EEA and believe we have not handled your
        data correctly, you may also complain to your local data
        protection authority.
      </p>
    </section>
  )
}
