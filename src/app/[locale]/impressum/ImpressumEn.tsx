import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import styles from "../datenschutz/legal.module.css";

/**
 * Courtesy English translation of the Impressum. The German version
 * (ImpressumDe) is the legally binding one — the disclosure duties under § 5
 * ECG, § 14 UGB and § 25 MedienG are owed in German, so this page carries a
 * note saying so rather than presenting itself as the operative text.
 *
 * Section numbering and the `styles.todo` gaps are kept identical to the
 * German version so the two can be reviewed side by side.
 */
export default function ImpressumEn() {
  return (
    <section className={`container ${styles.page}`}>
      <h1 className={styles.title}>Imprint</h1>
      <p className={styles.updated}>
        Disclosure pursuant to § 5 ECG, § 14 UGB and § 25 MedienG
      </p>

      <div className={styles.prose}>
        <h2>1. Media owner and service provider</h2>
        <div className={styles.contactCard}>
          <p>
            <strong>City-Ton Austria</strong>
          </p>
          <p>
            <span className={styles.todo}>
              Registered company name and legal form per the commercial register — to be supplied
              by the client
            </span>
          </p>
          <p>{site.contact.address}</p>
          <p>Austria</p>
          <p>Phone: {site.contact.phone}</p>
          <p>Email: {site.contact.email}</p>
          <p>Web: city-ton.com</p>
        </div>
        <p>
          Responsible for the content:{" "}
          <span className={styles.todo}>
            Name of the owner or authorised representative — to be supplied by the client
          </span>
        </p>

        <h2>2. Business activity</h2>
        <p>
          Consultation, planning and professional installation of architectural and window films
          (solar control, UV protection, privacy and safety films) on glass surfaces.
        </p>
        <p>
          Wording of the trade licence:{" "}
          <span className={styles.todo}>
            Trade licence wording per the Gewerbeschein — to be supplied by the client
          </span>
        </p>

        <h2>3. Commercial register and VAT</h2>
        <p>
          Commercial register number:{" "}
          <span className={styles.todo}>
            FN — to be supplied by the client; not applicable to an unregistered sole trader
          </span>
        </p>
        <p>
          Register court:{" "}
          <span className={styles.todo}>
            competent court — to be supplied by the client; for a Vienna-based business usually
            the Vienna Commercial Court
          </span>
        </p>
        <p>
          VAT identification number:{" "}
          <span className={styles.todo}>
            ATU — to be supplied by the client; not applicable under the small-business exemption
          </span>
        </p>

        <h2>4. Trade authority and chamber membership</h2>
        <p>
          Trade authority: Municipal District Office for the 22nd District, Vienna — the district
          administrative authority responsible for the registered office.
        </p>
        <p>
          Chamber membership: Vienna Chamber of Commerce,{" "}
          <span className={styles.todo}>
            trade group or association — to be supplied by the client
          </span>
        </p>
        <p>
          Applicable legislation: the Austrian Trade Act 1994 (Gewerbeordnung, GewO) as amended,
          available through the federal legal information system at{" "}
          <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer">
            ris.bka.gv.at
          </a>
          .
        </p>

        <h2>5. Editorial policy</h2>
        <p>
          This website serves to provide information about the services City-Ton Austria offers in
          the field of architectural and window films, and to allow interested parties to get in
          touch. It contains no periodical editorial content in the sense of news reporting.
        </p>

        <h2>6. Hosting</h2>
        <p>
          This website is operated on a server in Germany. Details of the data processing that
          takes place when the site is accessed can be found in our{" "}
          <Link href="/datenschutz">privacy policy</Link>.
        </p>

        <h2>7. Consumer dispute resolution</h2>
        <p>
          <span className={styles.todo}>
            To be determined by the client: willingness to take part in dispute resolution
            proceedings before a consumer arbitration board (as a rule: no obligation and no
            willingness)
          </span>
        </p>
        <p>
          Note: the European Commission&rsquo;s online dispute resolution platform was
          discontinued on 20 July 2025. A reference to it is therefore no longer to be included.
        </p>

        <h2>8. Liability for content</h2>
        <p>
          The content of this website has been compiled with the greatest possible care. We
          cannot, however, accept any warranty for its accuracy, completeness or currency.
          Figures for the technical characteristics of films (such as light transmission, total
          solar energy rejection or UV protection) are taken from the manufacturers&rsquo; data
          sheets and relate in each case to the glass build-up specified there. The effect
          achievable in an individual case depends on the type of glass, its coating, the
          installation situation and the orientation, and is determined on site.
        </p>

        <h2>9. Liability for links</h2>
        <p>
          This website contains links to external third-party websites over whose content we have
          no influence. Responsibility for the content of linked pages always lies with their
          respective provider. No legal infringements were apparent at the time the links were
          created.
        </p>

        <h2>10. Copyright</h2>
        <p>
          The content, texts, photographs and graphics published on this website are protected by
          copyright. Any use beyond the limits of copyright law requires our prior written
          consent. The brand and product names LLumar and Armolan, together with their associated
          logos, are the property of the respective manufacturers and are used with their consent.
        </p>
      </div>
    </section>
  );
}
