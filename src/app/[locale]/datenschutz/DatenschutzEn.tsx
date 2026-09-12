import { site } from "@/content/site";
import styles from "./legal.module.css";

/**
 * Courtesy English translation of the privacy policy. The German version
 * (DatenschutzDe) is the legally binding one, and the page carries a note
 * saying so.
 *
 * Section numbering, the GDPR article references and the `styles.todo` gaps
 * are kept identical to the German version so the two can be reviewed side by
 * side. Article citations stay in their standard form ("Art. 6(1)(f) GDPR").
 */
export default function DatenschutzEn() {
  return (
    <section className={`container ${styles.page}`}>
      <h1 className={styles.title}>Privacy policy</h1>
      <p className={styles.updated}>As of August 2026</p>

      <div className={styles.prose}>
        <p>
          Protecting your personal data matters to us. Below we inform you, in accordance with the
          General Data Protection Regulation (GDPR), which data we process when you visit this
          website, for what purpose and on what legal basis.
        </p>

        <h2>1. Controller</h2>
        <p>The controller for the data processing on this website is:</p>
        <div className={styles.contactCard}>
          <p>
            <strong>City-Ton Austria</strong>
          </p>
          <p>{site.contact.address}</p>
          <p>Austria</p>
          <p>
            <span className={styles.todo}>
              Registered company name and VAT number — to be supplied by the client
            </span>
          </p>
          <p>Phone: {site.contact.phone}</p>
          <p>Email: {site.contact.email}</p>
        </div>
        <p>
          No data protection officer has been appointed, as the statutory conditions requiring one
          are not met.
        </p>

        <h2>2. Hosting and server log files</h2>
        <p>
          This website is operated on a server in{" "}
          <span className={styles.todo}>location and provider — to be supplied by the client</span>{" "}
          . When the website is accessed, information is transmitted automatically to the server
          and stored temporarily in log files:
        </p>
        <ul>
          <li>IP address of the requesting device</li>
          <li>date and time of access</li>
          <li>page or file requested</li>
          <li>volume of data transferred and the access status message</li>
          <li>browser type, browser version and operating system</li>
          <li>referrer URL</li>
        </ul>
        <p>
          This processing takes place on the basis of our legitimate interest in the secure and
          stable operation of the website (Art. 6(1)(f) GDPR). These data are not combined with
          any other data sources.
        </p>

        <h2>3. Contacting us through the forms</h2>
        <p>Two forms are available on this website:</p>
        <h3>Enquiry form (&ldquo;Contact&rdquo; page)</h3>
        <p>
          We collect: name, type of property, optionally the surface area, your objective or
          objectives, telephone number and/or email address, and optionally a message.
        </p>
        <h3>Short enquiry (home page)</h3>
        <p>We collect a telephone number or email address only.</p>
        <p>
          We use these data solely to process your enquiry and to get in touch with you. The legal
          basis is Art. 6(1)(b) GDPR (steps taken prior to entering into a contract) together with
          your consent under Art. 6(1)(a) GDPR, which you give when submitting the enquiry form.
          You may withdraw your consent at any time with effect for the future.
        </p>
        <p>
          The data are stored in a database on the server named above and additionally sent by
          email to our mailbox. If you have provided an email address, you will receive an
          automatic acknowledgement of receipt.
        </p>
        <p>
          <strong>Retention period:</strong> we store your enquiry for as long as is necessary to
          process it, and at most{" "}
          <span className={styles.todo}>retention period — to be determined by the client</span>.
          Statutory retention obligations, in particular under the Austrian Commercial Code (UGB)
          and Federal Fiscal Code (BAO), remain unaffected.
        </p>

        <h2>4. Protection against automated requests (Cloudflare Turnstile)</h2>
        <p>
          To protect our forms against abusive automated use we employ Turnstile, a service of
          Cloudflare, Inc. In doing so, technical information about your browser and your IP
          address are transmitted to Cloudflare and evaluated there in order to determine whether
          the request originates from a human. Turnstile uses no cookies for recognition purposes
          and creates no user profile for advertising.
        </p>
        <p>
          The legal basis is our legitimate interest in warding off spam and abusive access
          (Art. 6(1)(f) GDPR). Cloudflare may also process data in third countries; such transfers
          are based on standard contractual clauses. Further information:{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            cloudflare.com/privacypolicy
          </a>
          .
        </p>

        <h2>5. Map display (Google Maps)</h2>
        <p>
          On the contact page we embed a map from Google Maps, a service of Google Ireland
          Limited. When the map loads, your IP address is transmitted to Google; processing may
          also take place on servers in the USA. The legal basis is our legitimate interest in
          making our location easy to find (Art. 6(1)(f) GDPR). Further information can be found
          in{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google&rsquo;s privacy policy
          </a>
          .
        </p>

        <h2>6. Web analytics (Google Analytics)</h2>
        <p>
          With your consent we use Google Analytics, a web analytics service provided by Google
          Ireland Limited. Usage data (including pages viewed, approximate location, device and
          browser information) are collected and processed on Google servers, possibly also in the
          USA, in order to analyse the use of this website statistically.
        </p>
        <p>
          Google Analytics is loaded only after you have expressly agreed in the cookie banner.
          The legal basis is your consent (Art. 6(1)(a) GDPR), which you may withdraw at any time
          with effect for the future by clearing your browser&rsquo;s site data for this page (the
          banner will then reappear) or by contacting us informally. Further information can be
          found in{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google&rsquo;s privacy policy
          </a>
          .
        </p>

        <h2>7. Cookies</h2>
        <p>
          This website sets <strong>no tracking or marketing cookies</strong> without your
          agreement. A technically necessary cookie is set in the internal administration area
          when a member of staff logs in there; your decision on the cookie banner is stored in
          your browser&rsquo;s local storage (not as a cookie). If you consent to web analytics,
          Google Analytics additionally sets its own cookies to recognise your browser (see
          point 6).
        </p>

        <h2>8. Fonts</h2>
        <p>
          The fonts used are served locally from our own server. No connection to third-party
          servers is therefore established when the page is loaded, and no data are transmitted to
          font providers.
        </p>

        <h2>9. Recipients and processors</h2>
        <p>
          Your data are passed on to third parties only where this is necessary to process your
          enquiry or where we are legally obliged to do so. Processors — in particular our hosting
          and email providers — are contractually bound in accordance with Art. 28 GDPR. Your data
          are never sold.
        </p>

        <h2>10. Your rights</h2>
        <p>You have the following rights against us in respect of your personal data:</p>
        <ul>
          <li>right of access (Art. 15 GDPR)</li>
          <li>right to rectification (Art. 16 GDPR)</li>
          <li>right to erasure (Art. 17 GDPR)</li>
          <li>right to restriction of processing (Art. 18 GDPR)</li>
          <li>right to data portability (Art. 20 GDPR)</li>
          <li>right to object to processing (Art. 21 GDPR)</li>
          <li>right to withdraw consent once given (Art. 7(3) GDPR)</li>
        </ul>
        <p>
          An informal message to{" "}
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> is enough to exercise
          your rights.
        </p>

        <h2>11. Right to lodge a complaint</h2>
        <p>
          If you believe that the processing of your data infringes data protection law, you may
          lodge a complaint with the supervisory authority:
        </p>
        <div className={styles.contactCard}>
          <p>
            <strong>Austrian Data Protection Authority</strong>
          </p>
          <p>Barichgasse 40&ndash;42, 1030 Vienna</p>
          <p>
            <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">
              www.dsb.gv.at
            </a>
          </p>
        </div>

        <h2>12. No automated decision-making</h2>
        <p>
          No automated decision-making, including profiling, within the meaning of Art. 22 GDPR
          takes place.
        </p>

        <h2>13. Changes to this privacy policy</h2>
        <p>
          We update this privacy policy whenever the processing or the legal framework changes.
          The version published on this page applies in each case.
        </p>
      </div>
    </section>
  );
}
