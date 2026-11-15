// Legal text for the website. Plain data so it is easy to review and edit.
// Each section: [heading, paragraphs[]]; a paragraph that is an array is a list.

export const LEGAL_UPDATED = '15 November 2026';

export const privacy = (site) => {
  const c = site.company;
  return [
    ['Who we are', [
      `${c.legalName} ("Fixmet", "we", "us") runs the Fixmet app for customers, the Fixmet Contractors app for tradespeople, and this website. We are registered in England & Wales (company no. ${c.number}) and our registered office is ${c.address}.`,
      `We are the controller of the personal data described in this policy. You can contact us about privacy at ${site.supportEmail}.`,
    ]],
    ['What we collect', [
      'Depending on how you use Fixmet, we collect:',
      [
        'Account details: your name, email address, phone number, password (stored only in a scrambled, hashed form) and, if you add one, a profile photo.',
        'Job details: the type of job, your description, photos, voice notes, the address and map location of the job, and when you want it done.',
        'Bookings and payments: prices, booking history, receipts, card holds and charges. You enter card details directly with Stripe, our payment provider. We never see or store your full card number.',
        'Messages: chats between a customer and a contractor about a job, and messages you send to our support team.',
        'Location: the customer app uses your location only when you choose to use it to find your address. The contractor app shares the contractor\'s location while they are online and during a job, including in the background while a job is active, so we can offer nearby jobs and the customer can see them arrive.',
        'Reviews and ratings that customers and contractors give each other.',
        'Device and technical data: push notification tokens, device type, app version, IP address, crash and error reports, and server logs.',
      ],
      'If you are a contractor, we also collect your trade and experience, the areas and hours you work, identity documents, DBS (criminal record) check, insurance, trade certificates and company details, your reliability record (for example cancellations), and your bank details for payouts. Bank details are collected and held by Stripe Connect.',
    ]],
    ['How we use your data and why', [
      [
        'To provide Fixmet (performance of our contract with you): to give you a price, take bookings, find and offer jobs to nearby contractors, hold and take payments, pay contractors, run in-app chat, send notifications and receipts, and give support.',
        'To price your job (performance of contract): your description, photos and voice note are analysed by OpenAI so we can estimate the work involved. Voice notes are turned into text first. The price itself is worked out by our own rate card. Under OpenAI\'s API terms, this data is not used to train their models.',
        'To keep people safe (legitimate interests and legal obligations): to check contractors\' identity, DBS checks and insurance before they can take jobs, to prevent fraud and misuse, and to investigate problems and complaints. We only use DBS information to decide whether someone is suitable to work in people\'s homes, with strict access controls.',
        'To meet legal duties (legal obligation): for example keeping accounting and tax records and answering lawful requests.',
        'To improve Fixmet (legitimate interests): using combined figures such as how many quotes are booked, how often prices change and how long it takes to find a contractor.',
        'Marketing: we only send marketing messages if you have agreed to receive them, and you can stop them at any time. Service messages about your jobs are not marketing.',
      ],
    ]],
    ['Who we share it with', [
      'We do not sell your personal data. We share it only as follows:',
      [
        'Between customer and contractor on a job: the customer sees the contractor\'s name, photo, rating, checks and live location while they are on the way; the contractor sees the job details, photos and voice note, and the address once they accept the job, and can message or call the customer.',
        'Stripe, for card payments and contractor payouts.',
        'OpenAI, to analyse job requests and transcribe voice notes.',
        'Google, for maps, address search and road routes, and Firebase Cloud Messaging for Android notifications; Apple, for iPhone notifications.',
        'Our hosting providers for the apps, database and file storage, and Vercel, which hosts this website.',
        'Our email delivery provider, for account and receipt emails.',
        'Professional advisers, insurers, the police or other authorities where the law requires it or to protect people from harm, and a buyer if our business is ever sold.',
      ],
      'These providers act on our instructions and must keep your data secure.',
    ]],
    ['International transfers', [
      'Some providers, such as OpenAI, Stripe and Google, may process data outside the UK, including in the United States. When that happens we rely on UK adequacy regulations, the UK International Data Transfer Agreement or Addendum, or other safeguards allowed by UK law.',
    ]],
    ['How long we keep it', [
      [
        'Job photos and voice notes: deleted 180 days after the job request, unless the job is still open or a problem report is being looked into.',
        'Chat messages: deleted 365 days after the job ends.',
        'Booking, payment and receipt records: kept for 6 years, as tax and accounting law requires.',
        'Contractor checks and documents: kept while the contractor uses Fixmet, then for as long as we need them to deal with complaints or legal claims.',
        'Your account: kept while it is open. When you delete it, we delete your profile, or anonymise it if it is linked to past bookings, and keep only what the law requires.',
      ],
    ]],
    ['Your rights', [
      'Under UK data protection law you can ask to see the personal data we hold about you, correct it, delete it, restrict or object to how we use it, and receive a copy in a portable format. Where we rely on your consent, you can withdraw it at any time.',
      `To use any of these rights, email ${site.supportEmail}. We will reply within one month. You can also complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113, although we would like the chance to put things right first.`,
    ]],
    ['Deleting your account', [
      'You can delete your account in either app under Profile, then Delete account. See our Delete your account page for the steps and what happens to your data.',
    ]],
    ['How we protect your data', [
      [
        'All connections to our apps, servers and website are encrypted.',
        'Passwords are hashed and never stored in a readable form, and staff accounts use two-step sign-in.',
        'Card details are handled only by Stripe.',
        'Contractor documents are stored privately, and job photos and voice notes can only be opened through links that expire.',
        'Access to personal data is limited to people who need it to run Fixmet.',
      ],
    ]],
    ['Children', [
      'Fixmet is for adults. You must be 18 or over to book a job or work as a contractor, and we do not knowingly collect data from children.',
    ]],
    ['This website', [
      'This website does not use advertising or analytics cookies. See our Cookie policy for details.',
    ]],
    ['Changes to this policy', [
      'We will update this policy when the way we use data changes. If a change is significant, we will tell you in the app or by email.',
    ]],
    ['Contact us', [
      `Email ${site.supportEmail}, or write to ${c.legalName}, ${c.address}.`,
    ]],
  ];
};

export const terms = (site) => {
  const c = site.company;
  return [
    ['About these terms', [
      `These terms apply when you use the Fixmet app, the Fixmet Contractors app or this website. They are provided by ${c.legalName}, registered in England & Wales (company no. ${c.number}), ${c.address}. By creating an account or booking a job, you agree to them.`,
    ]],
    ['What Fixmet does', [
      'Fixmet is a platform that connects people who need work done at home with independent, self-employed tradespeople ("contractors"). The contract for the work itself is between you and the contractor who accepts your job. Fixmet arranges the booking, takes payment on the contractor\'s behalf and supports both sides.',
      'Fixmet does not offer gas work. By law, work on gas appliances and pipes must be done by a Gas Safe registered engineer.',
    ]],
    ['Your account', [
      'You must be 18 or over and live in the UK to use Fixmet. Keep your login details private and make sure the information you give us is accurate. You are responsible for activity on your account.',
    ]],
    ['Prices', [
      'When you describe a job, we show you a price before you book. It is worked out from a rate card for each trade (hourly rate, call-out fee and minimum time), plus parts, and is checked by our system against your photos and description.',
      [
        'Instant jobs ("as soon as possible") cost more than booking a time. The app shows the difference before you book.',
        'Jobs in London cost more, in line with local trade rates.',
        'Some larger jobs, such as roofing and building work, show a guide price because they are hard to judge from photos.',
      ],
      'If the job turns out to be different when the contractor arrives, the contractor can send you a new price with a reason. The new price only applies if you approve it. If you decline, the agreed price stays and the contractor can either do the job at that price or cancel without charge to you.',
    ]],
    ['Payment', [
      'When you book, an amount is held on your card. This can be a little more than the price, so that an approved price change can be paid without asking for your card again. You are only charged the final agreed price, after the contractor marks the job as finished. Any unused part of the hold is released by your bank, which can take a few days.',
      'Payments are processed by Stripe. Fixmet collects payment for the contractor and passes it on after keeping its fee.',
    ]],
    ['Cancelling a job', [
      [
        'Before a contractor accepts, and for 3 minutes after, you can cancel for free.',
        'After that, and until the work starts, a cancellation fee of 10% of the price applies (at least £5). Most of this fee goes to the contractor who set off.',
        'Once work has started, the job cannot be cancelled in the app. If something is wrong, use Report a problem.',
        'If you are not there when the contractor arrives, they will wait 10 minutes and may then report a no-show. A no-show fee of 20% of the price applies (at least £10, never more than the price).',
        'Scheduled jobs follow the cancellation rules shown in the app when you book.',
      ],
      'These fees cover the contractor\'s time and travel. They do not affect your legal rights.',
    ]],
    ['Your right to cancel (cooling-off)', [
      'As a consumer you normally have 14 days to cancel a services contract. If you ask for work to start sooner, including any instant job, you will be asked to agree to this when you book. If you then cancel during the 14 days, you may have to pay for work already done, and you lose the right to cancel once the work is complete.',
    ]],
    ['The Fixmet guarantee', [
      site.guarantee,
      'This guarantee is in addition to your legal rights, including your right under the Consumer Rights Act 2015 to have services carried out with reasonable care and skill.',
    ]],
    ['Contractors and checks', [
      'Before contractors can take jobs, we check their identity and ask for a DBS check and insurance. We take reasonable care with these checks, but contractors are independent businesses responsible for their own work, tools, insurance and tax.',
    ]],
    ['What we expect from you', [
      [
        'Describe the job honestly and give safe access to the property.',
        'Treat contractors and our team with respect. We do not tolerate abuse, discrimination or unsafe behaviour.',
        'Do not arrange to pay a contractor you met through Fixmet outside the app for the same job.',
        'Do not misuse the apps, for example by making fake bookings or reviews.',
      ],
      'We may suspend or close accounts that break these terms.',
    ]],
    ['Contractor terms', [
      'If you join as a contractor, you also agree to the contractor terms shown in the Fixmet Contractors app, including how jobs are offered, Fixmet\'s fee, payouts and the rules on cancellations.',
    ]],
    ['Our responsibility to you', [
      'We are responsible for losses you suffer that are a foreseeable result of us breaking these terms or failing to use reasonable care and skill. We are not responsible for losses that were not foreseeable, or for business losses. Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited by law.',
    ]],
    ['Complaints', [
      `If something goes wrong, tell us in the app or email ${site.supportEmail}. We aim to reply within 2 working days.`,
    ]],
    ['Changes to these terms', [
      'We may update these terms. If a change is significant, we will tell you in the app or by email before it takes effect.',
    ]],
    ['Law', [
      'These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you can also bring proceedings in your local courts.',
    ]],
  ];
};

export const cookies = (site) => [
  ['Our website', [
    'This website does not set advertising or analytics cookies, and it does not track you across other websites.',
    'Pages load fonts from Google Fonts, which means Google receives your IP address to send the font files. Our hosting provider, Vercel, keeps short-term technical logs to run the site securely.',
  ]],
  ['Our apps', [
    'The Fixmet apps store a sign-in token securely on your phone so you stay logged in, and a few settings such as your chosen address. They do not use advertising trackers.',
  ]],
  ['Managing cookies', [
    'You can block or delete cookies in your browser settings. This website works without them.',
  ]],
  ['Contact', [
    `Questions? Email ${site.supportEmail}.`,
  ]],
];
