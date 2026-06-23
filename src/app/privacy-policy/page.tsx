const directInfoItems = [
  "Contact details including your name, address, phone number, and email.",
  "Order information including your name, billing address, shipping address, payment confirmation, email address, and phone number.",
  "Account information including your username, password, security questions and other information used for account security purposes.",
  "Customer support information including the information you choose to include in communications with us, for example, when sending a message through the Services."
];

const thirdPartyItems = [
  "Companies who support our Site and Services, such as Shopify.",
  "Our payment processors, who collect payment information to process your payment in order to fulfill your orders and provide you with products or services you have requested.",
  "Online tracking technologies such as pixels, web beacons, software developer kits, third-party libraries, and cookies."
];

const disclosureItems = [
  "With vendors or other third parties who perform services on our behalf, such as IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping.",
  "With business and marketing partners to provide services and advertise to you.",
  "When you direct, request us or otherwise consent to our disclosure of certain information to third parties.",
  "With our affiliates or otherwise within our corporate group, in our legitimate interests to run a successful business.",
  "In connection with a business transaction such as a merger or bankruptcy, to comply with applicable legal obligations, enforce terms of service, and protect or defend the Services, our rights, and the rights of users or others."
];

const rightsItems = [
  "Right to Access / Know: You may have a right to request access to personal information that we hold about you.",
  "Right to Delete: You may have a right to request that we delete personal information we maintain about you.",
  "Right to Correct: You may have a right to request that we correct inaccurate personal information we maintain about you.",
  "Right of Portability: You may have a right to receive a copy of the personal information we hold about you and request transfer to a third party.",
  "Right to Opt out of Sale or Sharing or Targeted Advertising: You may have a right to direct us not to sell or share your personal information.",
  "Restriction of Processing: You may have the right to ask us to stop or restrict our processing of personal information.",
  "Withdrawal of Consent: Where we rely on consent to process your personal information, you may have the right to withdraw this consent.",
  "Appeal: You may have a right to appeal our decision if we decline to process your request.",
  "Managing Communication Preferences: You may opt out of promotional emails at any time by using the unsubscribe option displayed in our emails."
];

function Paragraph({ children }: { children: string }) {
  return <p className="mt-4 text-base leading-8 text-charcoal">{children}</p>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid gap-3 text-base leading-7 text-charcoal">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <p className="text-sm font-normal uppercase tracking-[0.16em] text-graphite">Customer Service</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight text-ink sm:text-5xl">Privacy Policy</h1>
        <p className="mt-6 text-base leading-8 text-graphite">Last updated: April 1, 2026</p>

        <div className="mt-12 grid gap-10">
          <PolicySection title="Overview">
            <Paragraph>
              {`This Privacy Policy describes how Hydroglide (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from hydroglide.com (the "Site") or otherwise communicate with us regarding the Site (collectively, the "Services"). For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.`}
            </Paragraph>
            <Paragraph>Please read this Privacy Policy carefully.</Paragraph>
          </PolicySection>

          <PolicySection title="Changes to This Privacy Policy">
            <Paragraph>
              {`We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.`}
            </Paragraph>
          </PolicySection>

          <PolicySection title="How We Collect and Use Your Personal Information">
            <Paragraph>
              To provide the Services, we collect and have collected over the past 12 months personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.
            </Paragraph>
            <Paragraph>
              In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide or improve the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.
            </Paragraph>
          </PolicySection>

          <PolicySection title="What Personal Information We Collect">
            <Paragraph>
              {`The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you.`}
            </Paragraph>
          </PolicySection>

          <PolicySection title="Information We Collect Directly from You">
            <Paragraph>Information that you directly submit to us through our Services may include:</Paragraph>
            <BulletList items={directInfoItems} />
            <Paragraph>
              Some features of the Services may require you to directly provide us with certain information about yourself. You may elect not to provide this information, but doing so may prevent you from using or accessing these features.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Information We Collect about Your Usage">
            <Paragraph>
              {`We may also automatically collect certain information about your interaction with the Services ("Usage Data"). To do this, we may use cookies, pixels and similar technologies ("Cookies"). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.`}
            </Paragraph>
          </PolicySection>

          <PolicySection title="Information We Obtain from Third Parties">
            <Paragraph>We may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as:</Paragraph>
            <BulletList items={thirdPartyItems} />
            <Paragraph>
              Any information we obtain from third parties will be treated in accordance with this Privacy Policy. Also see the section below, Third Party Websites and Links.
            </Paragraph>
          </PolicySection>

          <PolicySection title="How We Use Your Personal Information">
            <Paragraph>
              Providing Products and Services. We use your personal information to provide you with the Services in order to perform our contract with you, including to process your payments, fulfill your orders, send notifications related to your account, purchases, returns, exchanges or other transactions, create and manage your account, arrange for shipping, facilitate returns and exchanges, and support other features related to your account.
            </Paragraph>
            <Paragraph>
              Marketing and Advertising. We may use your personal information for marketing and promotional purposes, such as to send marketing communications by email, text message or postal mail, and to show you advertisements for products or services.
            </Paragraph>
            <Paragraph>
              Security and Fraud Prevention. We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity.
            </Paragraph>
            <Paragraph>
              Communicating with You and Service Improvement. We use your personal information to provide customer support and improve our Services.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Cookies">
            <Paragraph>
              Like many websites, we use Cookies on our Site. We use Cookies to power and improve our Site and Services, remember your actions and preferences, run analytics, and better understand user interaction with the Services.
            </Paragraph>
            <Paragraph>
              Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls. Removing or blocking Cookies may negatively impact your user experience.
            </Paragraph>
            <Paragraph>
              Our website also recognizes the Global Privacy Control (GPC) signal, which enables you to opt out of certain uses or disclosures of your information. To learn more, visit https://globalprivacycontrol.org/.
            </Paragraph>
          </PolicySection>

          <PolicySection title="How We Disclose Personal Information">
            <Paragraph>
              In certain circumstances, we may disclose your personal information to third parties for contract fulfillment purposes, legitimate purposes and other reasons subject to this Privacy Policy. Such circumstances may include:
            </Paragraph>
            <BulletList items={disclosureItems} />
            <Paragraph>
              We do not use or disclose sensitive personal information without your consent or for the purposes of inferring characteristics about you.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Personal Information Shared for Advertising">
            <div className="mt-4 overflow-x-auto border border-line">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm text-charcoal">
                <thead className="bg-porcelain text-ink">
                  <tr>
                    <th className="border-b border-line px-4 py-3 font-semibold">Category of Personal Information</th>
                    <th className="border-b border-line px-4 py-3 font-semibold">Categories of Recipients</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-line px-4 py-3">Identifiers such as name, email address and phone number</td>
                    <td className="border-b border-line px-4 py-3">Business and marketing partners</td>
                  </tr>
                  <tr>
                    <td className="border-b border-line px-4 py-3">Commercial information such as records of products or services purchased</td>
                    <td className="border-b border-line px-4 py-3">Business and marketing partners</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Usage Data</td>
                    <td className="px-4 py-3">Business and marketing partners</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PolicySection>

          <PolicySection title="User Generated Content">
            <Paragraph>
              The Services may enable you to post product reviews and other user-generated content. If you choose to submit user generated content to any public area of the Services, this content will be public and accessible by anyone.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Third Party Websites and Links">
            <Paragraph>
              Our Site may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Children's Data">
            <Paragraph>
              The Services are not intended to be used by children, and we do not knowingly collect any personal information about children. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us to request that it be deleted.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Security and Retention of Your Information">
            <Paragraph>
              Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee perfect security. How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, provide the Services, comply with legal obligations, resolve disputes or enforce applicable contracts and policies.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Your Rights">
            <Paragraph>
              Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. These rights are not absolute and may apply only in certain circumstances.
            </Paragraph>
            <BulletList items={rightsItems} />
            <Paragraph>
              You may exercise any of these rights where indicated on our Site or by contacting us using the contact details provided below. We will not discriminate against you for exercising any of these rights.
            </Paragraph>
          </PolicySection>

          <PolicySection title="Complaints">
            <Paragraph>
              If you have complaints about how we process your personal information, please contact us using the contact details provided below. If you are not satisfied with our response, depending on where you live you may have the right to appeal our decision or lodge your complaint with your local data protection authority.
            </Paragraph>
          </PolicySection>

          <PolicySection title="International Users">
            <Paragraph>
              {`Please note that we may transfer, store and process your personal information outside the country you live in. If we transfer your personal information out of Europe, we will rely on recognized transfer mechanisms such as the European Commission's Standard Contractual Clauses or equivalent contracts issued by the relevant competent authority of the UK.`}
            </Paragraph>
          </PolicySection>

          <section className="border-t border-line pt-10">
            <h2 className="text-xl font-semibold text-ink">Contact</h2>
            <Paragraph>
              Should you have any questions about our privacy practices or this Privacy Policy, or if you would like to exercise any of the rights available to you, please call or email us at hydroglide@gmail.com.
            </Paragraph>
            <Paragraph>
              For the purpose of applicable data protection laws and if not explicitly stated otherwise, we are the data controller of your personal information.
            </Paragraph>
          </section>
        </div>
      </section>
    </main>
  );
}
