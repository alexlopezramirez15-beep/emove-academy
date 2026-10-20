/* ============ Academy content ============
   Course → Unit → Activity. Activity types (handled in academy.js):
   learn  · read a short idea with key points
   cards  · tap to discover a set of cards
   choice · one correct option, feedback on every option (with an optional scenario)
   tf     · true or false statements, explained
   sort   · put each item in the right box
   order  · put the steps in the right order
   reflect· write a short answer that stays in "My notes"
   Rules are summarised from the Erasmus+ Programme Guide; every unit reminds teachers to check the current guide. */
const COURSES = [{
  id: "erasmus-101",
  title: "Erasmus+ from scratch",
  sub: "How a teacher gets funded to learn abroad, step by step",
  minutes: 60,
  units: [
    {
      id: "u1", title: "What Erasmus+ offers teachers", goal: "Understand what Erasmus+ pays for and who applies.", icon: "stars",
      activities: [
        { type: "learn", title: "Erasmus+ in one minute", body: "Erasmus+ is the European Union's programme for education, training, youth and sport (2021–2027). For teachers and school staff it funds **learning abroad**: courses, observing colleagues in another school and teaching in a partner school.", points: ["The **school** applies, not the individual teacher.", "The grant covers travel, daily costs and course fees.", "Each country has a **National Agency** that runs the calls and answers questions."], tip: "If your school has never applied, nothing is lost: there is an entry route designed for newcomers (unit 2)." },
        { type: "cards", title: "Three ways to learn abroad", intro: "Tap each card to discover the three staff mobility activities in school education.", cards: [
          { t: "Courses and training", d: "A structured course with other European teachers, from 2 to 30 days. eMove courses belong here.", icon: "academy" },
          { t: "Job shadowing", d: "You spend 2 to 60 days observing colleagues in a school or organisation abroad.", icon: "eye" },
          { t: "Teaching assignment", d: "You teach in a partner school abroad, from 2 to 365 days.", icon: "teacher" }
        ] },
        { type: "sort", q: "Key Action 1 or Key Action 2? Put each project in its box.", buckets: ["KA1 · Learning mobility", "KA2 · Cooperation between organisations"], items: [
          { t: "A teacher attends a 5-day course in Cádiz", b: 0 },
          { t: "Two schools co-design a climate curriculum over two years", b: 1 },
          { t: "A coordinator shadows a colleague in Finland", b: 0 },
          { t: "Five schools build shared teaching materials together", b: 1 },
          { t: "A group of pupils travels to a partner school", b: 0 }
        ], explain: "KA1 moves **people** to learn (staff and pupils). KA2 funds **organisations** working together on a shared product or practice." },
        { type: "choice", q: "Who submits the Erasmus+ application for a teacher's course?", options: ["The teacher, on their own", "The school (or a consortium it belongs to)", "The course provider", "The Ministry of Education"], answer: 1, why: ["Individual teachers cannot apply for school staff mobility on their own.", "Correct. The school, or a consortium led for example by a regional education authority, applies to the National Agency.", "Providers like eMove give you the programme and certificate, but they do not apply for you.", "Ministries set policy; applications go to the National Agency."] },
        { type: "tf", title: "True or false?", items: [
          { s: "Only language teachers can take part in Erasmus+.", a: false, why: "Any school staff can take part: teachers of every subject, leaders, counsellors and support staff." },
          { s: "Erasmus+ can pay the fee of a structured course.", a: true, why: "Course fees are a specific budget item for courses and training." },
          { s: "You need to speak perfect English to go.", a: false, why: "You need enough language to learn. Many teachers prepare with online courses before leaving." }
        ] }
      ]
    },
    {
      id: "u2", title: "Choose your route", goal: "Know which door your school can use: KA122, accreditation or a consortium.", icon: "compass",
      activities: [
        { type: "learn", title: "Three doors into Erasmus+", body: "Schools reach Erasmus+ mobility through one of three doors. Which one depends on your experience and on how many mobilities you plan.", points: ["**KA122 short-term project**: no accreditation needed. Up to 30 participants, a project of 6 to 18 months. The usual first step.", "**Erasmus accreditation (KA120)**: a long-term Erasmus Plan. Accredited schools then request a budget every year through **KA121**.", "**Consortium**: join a group led by a coordinator (often a regional or local education authority) that already holds an accreditation."], tip: "Main deadlines are usually in February; some countries open a second KA122 round in the autumn. Always check your National Agency's calendar." },
        { type: "choice", scenario: "Your school has never done Erasmus+. Four teachers want to take a course next summer.", q: "Which route fits best?", options: ["KA122 short-term project", "KA121 accredited project", "A KA2 cooperation partnership"], answer: 0, why: ["Correct. KA122 is designed for organisations without accreditation that want a manageable first project.", "KA121 is only for schools that already hold an Erasmus accreditation.", "KA2 funds cooperation projects between organisations, not individual training."] },
        { type: "choice", scenario: "Your school holds an Erasmus accreditation and has a five-year Erasmus Plan.", q: "How does it get money for this year's mobilities?", options: ["It writes a full new project every year", "It requests a budget through KA121", "It waits for a consortium to invite it"], answer: 1, why: ["Accredited schools do not need to write a full project each time.", "Correct. The accreditation is the quality badge; KA121 is the yearly budget request.", "Accredited schools apply in their own name."] },
        { type: "choice", scenario: "A small rural school has no time to manage a project but would like two teachers to train abroad.", q: "What is the simplest option?", options: ["Give up for this year", "Ask the regional education authority or the National Agency about joining a consortium", "Ask the teachers to apply individually"], answer: 1, why: ["There is an easier door for small schools.", "Correct. In a consortium the coordinator handles most of the management.", "Individual teachers cannot apply for school staff mobility."] },
        { type: "order", q: "Put a KA122 application in order, from idea to grant.", steps: ["Identify your school's needs", "Set objectives for the project", "Choose activities and providers", "Register the school (OID) and apply to the National Agency before the deadline", "Evaluation, results and grant agreement"], explain: "Needs come first. The course you choose must answer them; that is what evaluators look for." },
        { type: "reflect", q: "Which route fits your school today, and why?", placeholder: "For example: KA122, because we have never applied and want a small first project…" }
      ]
    },
    {
      id: "u3", title: "Plan a mobility that changes things", goal: "Link objectives, course choice and preparation to your school's needs.", icon: "target",
      activities: [
        { type: "learn", title: "Needs first, destination second", body: "Strong projects start from what the school needs, not from a city. Every mobility should answer a need and come back as a change in class or in the school.", points: ["Write objectives that are **specific and measurable**.", "Choose courses whose **learning outcomes** match those objectives.", "Plan how you will **share** what you learn before you leave."], tip: "The Erasmus Quality Standards ask for good preparation, support during the mobility and sharing afterwards." },
        { type: "sort", q: "Strong or weak objective? Sort them.", buckets: ["Strong objective", "Too vague"], items: [
          { t: "Improve our school", b: 1 },
          { t: "By June, three teachers use game-based learning in Year 7 maths and share it with their department", b: 0 },
          { t: "Learn new things in Europe", b: 1 },
          { t: "Reduce early burnout signs: run a wellbeing routine with staff every term", b: 0 },
          { t: "Be more innovative", b: 1 }
        ], explain: "A strong objective says **who** does **what**, **by when**, and how you will know it happened." },
        { type: "choice", q: "You are choosing a course. What matters most for your application?", options: ["The cheapest course", "Learning outcomes that match your objectives", "The most beautiful destination", "The longest course available"], answer: 1, why: ["Cost matters, but evaluators look at relevance first.", "Correct. Relevance to your needs is what makes a mobility worth funding.", "A great place helps motivation, but it is not a reason in itself.", "Longer is not better; it must fit your objectives and timetable."] },
        { type: "sort", q: "Before, during or after the mobility?", buckets: ["Before", "During", "After"], items: [
          { t: "Agree learning objectives with your school", b: 0 },
          { t: "Keep a learning journal", b: 1 },
          { t: "Run a workshop for colleagues", b: 2 },
          { t: "Prepare language and practical details", b: 0 },
          { t: "Network with teachers from other countries", b: 1 },
          { t: "Try a new method with your class", b: 2 }
        ], explain: "The impact of a mobility is built **before** (clear goals) and **after** (sharing and applying), not only during the course." },
        { type: "reflect", q: "Write one objective for your own mobility.", placeholder: "Who, what, by when, and how you will know it happened…" }
      ]
    },
    {
      id: "u4", title: "The money", goal: "Know what the grant covers and how it is calculated.", icon: "wallet",
      activities: [
        { type: "cards", title: "What the grant can cover", intro: "Erasmus+ mostly uses **unit costs**: fixed amounts per participant, per day or per distance. Tap each card.", cards: [
          { t: "Travel", d: "A fixed amount based on the distance band between your town and the destination. Green travel can receive a higher amount.", icon: "plane" },
          { t: "Individual support", d: "A daily amount for accommodation and living costs. It depends on the destination country.", icon: "home" },
          { t: "Course fees", d: "For courses and training: an amount per participant per day of the course, up to a maximum per participant.", icon: "academy" },
          { t: "Organisational support", d: "A fixed amount per participant for the school's work: preparation, follow-up and sharing.", icon: "school" },
          { t: "Inclusion support", d: "Extra funding for participants with fewer opportunities or special needs.", icon: "hands" }
        ] },
        { type: "sort", q: "Can the grant pay for it?", buckets: ["Covered by the grant", "Not covered"], items: [
          { t: "The flight or train to the course", b: 0 },
          { t: "Accommodation and meals during the course", b: 0 },
          { t: "The course fee", b: 0 },
          { t: "Extra holiday days after the course", b: 1 },
          { t: "Souvenirs for the staff room", b: 1 }
        ], explain: "The grant covers the learning activity and the days needed to travel. Private extensions are paid by the participant." },
        { type: "choice", q: "How is the course-fee grant calculated?", options: ["The real invoice, whatever it costs", "A fixed amount per participant per day, up to a maximum", "A percentage of the school budget"], answer: 1, why: ["Erasmus+ does not reimburse invoices for course fees; it uses unit costs.", "Correct. Check the current Programme Guide for the daily amount and the maximum.", "The grant is calculated per participant, not from the school budget."] },
        { type: "tf", title: "True or false?", items: [
          { s: "Choosing a train instead of a plane can increase the travel grant.", a: true, why: "Green travel (train, bus, car-sharing) receives a higher travel amount." },
          { s: "Daily amounts are the same in every destination.", a: false, why: "Individual support depends on the destination country group and is set by each National Agency within EU ranges." }
        ] }
      ]
    },
    {
      id: "u5", title: "Before, during and after", goal: "Turn your mobility into impact you can show.", icon: "route",
      activities: [
        { type: "learn", title: "Coming back is where it starts", body: "Your school has to show what changed thanks to the mobility. Teachers who share early and simply make that easy.", points: ["Ask for your **certificate of attendance** and a **Europass Mobility** document to record your new skills.", "Complete the **participant report** you receive by email after the mobility.", "Share with colleagues and the school community: a workshop, a post, an eTwinning project."], tip: "The school submits its final report in the Beneficiary Module. Your notes and photos help a lot." },
        { type: "order", q: "Put the steps after your return in a sensible order.", steps: ["Complete the participant report", "Share what you learned with colleagues", "Try one new practice with your class", "Show the results to the school community", "The school includes everything in its final report"], explain: "Report, share, apply, show, document: a simple loop that evaluators recognise." },
        { type: "choice", scenario: "You came back from a course on game-based learning.", q: "Which sharing activity has the most impact?", options: ["Post a photo of the beach", "A 30-minute workshop where colleagues try one activity", "Email the slides of the course to everyone", "Keep it for your own class"], answer: 1, why: ["A nice memory, but it shows no learning.", "Correct. Colleagues trying the activity is the fastest way to spread it.", "Slides without practice are rarely used.", "Erasmus+ expects the learning to benefit the whole school."] },
        { type: "reflect", q: "Write one action you will take within two weeks of coming back.", placeholder: "For example: run a short workshop at the next staff meeting…" }
      ]
    }
  ],
  quiz: [
    { q: "Who applies for an Erasmus+ grant for school staff?", options: ["The teacher", "The school or a consortium", "The course provider"], answer: 1 },
    { q: "Which route is designed for schools without accreditation?", options: ["KA121", "KA122", "KA220"], answer: 1 },
    { q: "How long can a structured course last?", options: ["2 to 30 days", "Exactly 5 days", "Up to one year"], answer: 0 },
    { q: "What do accredited schools use to request their yearly budget?", options: ["KA121", "KA210", "eTwinning"], answer: 0 },
    { q: "What should guide your choice of course?", options: ["The destination", "The price", "Your school's needs and objectives"], answer: 2 },
    { q: "How does Erasmus+ calculate most grant items?", options: ["Real invoices", "Unit costs", "A lottery"], answer: 1 },
    { q: "What can increase the travel grant?", options: ["Green travel", "Flying business class", "Travelling at weekends"], answer: 0 },
    { q: "Which document records the skills you gained abroad?", options: ["Europass Mobility", "A boarding pass", "The OID"], answer: 0 }
  ]
}];

const GLOSSARY = [
  ["KA1", "Key Action 1: learning mobility of individuals (staff and pupils)."],
  ["KA2", "Key Action 2: cooperation partnerships between organisations (KA210 small-scale, KA220 cooperation partnerships)."],
  ["KA120", "Erasmus accreditation: a long-term Erasmus Plan that opens yearly KA121 funding."],
  ["KA121", "Yearly budget request for accredited organisations."],
  ["KA122", "Short-term mobility project for organisations without accreditation."],
  ["National Agency", "The body in each country that manages Erasmus+ calls, grants and support."],
  ["OID", "Organisation ID: the code your school needs before it can apply."],
  ["Consortium", "A group of schools coordinated by one organisation that holds an accreditation and manages mobilities for all."],
  ["Unit costs", "Fixed amounts per participant, per day or per distance used to calculate the grant."],
  ["Green travel", "Travel by low-emission means such as train or bus, which receives a higher travel amount."],
  ["Job shadowing", "Observing colleagues at work in a school or organisation abroad."],
  ["Erasmus Quality Standards", "Common principles every mobility project must follow: good management, inclusion, sustainability and sharing results."],
  ["Europass Mobility", "A European document that records the knowledge and skills gained during a stay abroad."],
  ["Beneficiary Module", "The online tool where schools manage their project and submit the final report."],
  ["ESEP", "European School Education Platform: news, courses and the eTwinning community in one place."],
  ["eTwinning", "Free online community where schools collaborate on projects, now part of ESEP."]
];
