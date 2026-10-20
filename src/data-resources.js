/* ============ Teaching resources ============
   Every resource belongs to one eMove pathway, so it can lead to the course that goes deeper. */
const RES_TYPES = ["Activity", "Routine", "Lesson plan", "Rubric", "Template"];
const RESOURCES = [
  {
    id: "mission-escape", title: "Mission: the 15-minute escape", pathway: "future", type: "Activity", stages: ["Primary", "Lower secondary", "Upper secondary"], minutes: 50,
    summary: "Turn a revision lesson into a mission: teams unlock four locks by solving content challenges.",
    objective: "Students review key content of a unit through cooperative challenges with immediate feedback.",
    steps: ["Pick four key ideas of the unit and write one challenge for each (a question, a puzzle, a short problem).", "Give each answer a code: a number, a word or a colour that opens a 'lock'.", "Tell the story: the class has 15 minutes to free a trapped scientist, author or explorer.", "Teams of 3–4 solve the challenges in order. Check each code at your desk: right code, next envelope.", "Debrief for 10 minutes: which challenge was hardest and why?"],
    materials: ["4 envelopes per team", "Printed challenges", "A visible timer"],
    assessment: "Note which challenge blocked most teams: that is the content to reteach.",
    variation: "Digital version: use a form that only advances with the right answer."
  },
  {
    id: "ai-feedback-check", title: "AI as a critical friend", pathway: "future", type: "Lesson plan", stages: ["Upper secondary", "Vocational (VET)", "Adult education"], minutes: 55,
    summary: "Students compare AI feedback with a rubric and decide what to accept, fix or reject.",
    objective: "Students use AI responsibly: they evaluate its suggestions against criteria instead of copying them.",
    steps: ["Students write a short paragraph (an argument, a lab conclusion, a description).", "They ask an AI tool for feedback using a prompt you give them.", "In pairs, they compare each AI suggestion with the class rubric: accept, adapt or reject, and write why.", "They rewrite the paragraph and highlight what changed.", "Close with a class rule: 'AI suggests, I decide'."],
    materials: ["A simple 3-criteria rubric", "Access to an AI tool allowed by your school"],
    assessment: "Grade the reasons in the accept/adapt/reject table, not only the final text.",
    variation: "Without devices: print an AI answer in advance and do the comparison on paper."
  },
  {
    id: "think-routine", title: "See, think, wonder in 10 minutes", pathway: "excellence", type: "Routine", stages: ["All stages"], minutes: 10,
    summary: "A thinking routine to open any topic with an image, an object or a data chart.",
    objective: "Students separate observation from interpretation and generate their own questions.",
    steps: ["Show an image, object or chart connected to the new topic.", "SEE (3 min): students list only what they can observe. No interpretations yet.", "THINK (3 min): what do they think is going on? Ask 'What makes you say that?'", "WONDER (3 min): each student writes one question.", "Keep the questions visible and return to them at the end of the unit."],
    materials: ["One rich image, object or chart", "Sticky notes"],
    assessment: "Look at the questions: are they factual or do they open real inquiry?",
    variation: "With younger pupils, do it orally and draw the questions."
  },
  {
    id: "exit-ticket", title: "Three exit tickets that change tomorrow's lesson", pathway: "excellence", type: "Template", stages: ["All stages"], minutes: 5,
    summary: "Three quick formats to know in two minutes what your class understood.",
    objective: "Teachers collect evidence of learning at the end of a lesson and adapt the next one.",
    steps: ["3-2-1: three things I learned, two questions I have, one thing I can apply.", "Traffic light: green 'I can explain it', amber 'nearly', red 'I need help', plus one sentence why.", "The muddiest point: what was the least clear part of today?", "Sort the tickets into three piles in two minutes.", "Start the next lesson with the most common doubt."],
    materials: ["Half sheets of paper or a short online form"],
    assessment: "The ticket is the assessment: count the reds and plan your opening.",
    variation: "Rotate the three formats so students don't answer on autopilot."
  },
  {
    id: "staff-wellbeing", title: "The 15-minute wellbeing check-in for staff", pathway: "wellbeing", type: "Routine", stages: ["All stages"], minutes: 15,
    summary: "A short, safe routine to open staff meetings and reduce isolation.",
    objective: "Teams create a habit of noticing workload and supporting each other.",
    steps: ["Open with one question on a scale from 1 to 5: 'How full is your battery this week?'", "In threes, each person shares one thing that drained and one that recharged them (2 minutes each).", "Each trio agrees one small thing they can do for each other this week.", "Close with one sentence in the full group, voluntary.", "Repeat at the start of every meeting for a term."],
    materials: ["Nothing; an optional anonymous form for the battery score"],
    assessment: "Track the anonymous average battery score over the term.",
    variation: "Do it with students as a Monday morning circle."
  },
  {
    id: "calm-corner", title: "Build a calm corner with your class", pathway: "wellbeing", type: "Activity", stages: ["Early childhood", "Primary"], minutes: 45,
    summary: "Students co-design a space and a routine to calm down before returning to work.",
    objective: "Pupils learn to recognise emotions and choose a strategy to regulate them.",
    steps: ["Read a short story about a strong emotion and talk about how the body feels.", "Brainstorm what helps them calm down: breathing, drawing, a soft object, counting.", "Choose three strategies together and make a visual card for each.", "Agree the rules: when to go, for how long (a sand timer), how to come back.", "Practise once with everyone so the corner is not a punishment."],
    materials: ["Cushion or chair", "Sand timer", "Strategy cards"],
    assessment: "After two weeks, ask the class what works and adjust the cards.",
    variation: "In secondary, use a 'reset card' with breathing steps instead of a corner."
  },
  {
    id: "udl-menu", title: "A learning menu for every student", pathway: "inclusion", type: "Lesson plan", stages: ["Primary", "Lower secondary", "Upper secondary"], minutes: 60,
    summary: "Offer the same goal through three ways in: read, watch or do, and three ways out.",
    objective: "All students reach the same learning goal through different paths (Universal Design for Learning).",
    steps: ["Write one clear goal for the lesson and share it on the board.", "Prepare three inputs: a short text, a short video and a hands-on task with the same content.", "Students choose one input, then check with a peer who chose another.", "Offer three ways to show learning: explain orally, draw a diagram or write a paragraph.", "Use the same success criteria for all three outputs."],
    materials: ["One text, one video, one hands-on task", "Success criteria card"],
    assessment: "Same criteria, different formats: you assess the learning, not the format.",
    variation: "Start with two options if the class is new to choice."
  },
  {
    id: "strengths-cards", title: "Strengths cards", pathway: "inclusion", type: "Activity", stages: ["Primary", "Lower secondary"], minutes: 40,
    summary: "Students discover and name each other's strengths to build a positive class identity.",
    objective: "Students recognise their strengths and see differences as a resource for the group.",
    steps: ["Show a set of strength words: curious, patient, creative, organised, kind, brave, funny, fair…", "Each student picks two strengths they see in themselves.", "In groups, each member gives one strength to every other member with an example.", "Students make a card with their four strengths and keep it on their desk.", "Use the cards when forming teams: 'We need someone organised and someone creative'."],
    materials: ["Strength word list", "Card paper"],
    assessment: "Observe whether students use the strength words when they work in teams.",
    variation: "Add strengths in the languages spoken in your class."
  },
  {
    id: "school-grounds", title: "Outdoor maths trail in the school grounds", pathway: "sustainability", type: "Activity", stages: ["Primary", "Lower secondary"], minutes: 50,
    summary: "Take a maths lesson outside: measure, estimate and map real things around the school.",
    objective: "Students apply measurement and estimation in a real context and connect with their environment.",
    steps: ["Prepare 5 stations around the grounds: a tree, a path, a wall, a bench, a garden bed.", "At each station, teams estimate first, then measure (height, perimeter, area, angle).", "They record the difference between estimate and measurement.", "Back inside, they draw a simple map of the grounds with their data.", "Discuss: which space could we improve for nature or for play?"],
    materials: ["Measuring tapes", "Clipboards", "Station cards"],
    assessment: "Check how the estimates improve from station 1 to station 5.",
    variation: "Use the same trail for science: count species at each station."
  },
  {
    id: "waste-audit", title: "Classroom waste audit", pathway: "sustainability", type: "Lesson plan", stages: ["Primary", "Lower secondary", "Upper secondary"], minutes: 60,
    summary: "Students measure the waste of their classroom for a week and propose a real change.",
    objective: "Students collect data, analyse it and act on an environmental problem close to them.",
    steps: ["For one week, keep separate bins: paper, plastic, organic, other.", "Each day, a team weighs or counts the waste and records it in a table.", "Make a chart and find the biggest category.", "Teams propose one action to reduce it and present it to the class.", "Vote one action, apply it for two weeks and measure again."],
    materials: ["Bins or bags", "Kitchen scale", "Data table"],
    assessment: "Compare the data before and after the action.",
    variation: "Share the results with a partner school through eTwinning."
  },
  {
    id: "europe-map", title: "Our class on the map of Europe", pathway: "citizenship", type: "Activity", stages: ["Primary", "Lower secondary"], minutes: 45,
    summary: "Students trace the European connections of their own lives: food, family, music, travel, products.",
    objective: "Students discover that Europe is part of their daily life and reflect on shared values.",
    steps: ["Each student finds three European connections at home: a product, a song, a relative, a trip.", "Pin them on a large map of Europe with a short label.", "In groups, look for patterns: which countries appear most? Why?", "Read together one article of the EU Charter of Fundamental Rights and connect it to the class.", "Write a class postcard to a school in another country."],
    materials: ["Large map of Europe", "Pins or stickers", "Postcard"],
    assessment: "Ask each student to explain one connection and one shared value.",
    variation: "Send the postcard through an eTwinning project and wait for the reply."
  },
  {
    id: "change-canvas", title: "One-page change plan for school leaders", pathway: "leadership", type: "Template", stages: ["All stages"], minutes: 30,
    summary: "A one-page template to plan a change in your school, from need to evidence.",
    objective: "School leaders and coordinators plan a change that staff understand and can measure.",
    steps: ["Need: what problem do we see and how do we know?", "Goal: what will be different in one year?", "People: who leads, who takes part, who needs to be convinced?", "Actions: three first steps with dates.", "Evidence: what will we look at to know it worked?", "Share the page with staff and ask for one improvement each."],
    materials: ["The one-page template (print this resource)"],
    assessment: "Review the page every term with the team.",
    variation: "Use the same page to write the needs section of an Erasmus+ application."
  },
  {
    id: "mobility-plan", title: "My Erasmus+ mobility plan", pathway: "leadership", type: "Template", stages: ["All stages"], minutes: 20,
    summary: "A template to prepare a mobility: objectives, sharing plan and evidence of impact.",
    objective: "Teachers arrive at their course with clear goals and come back with a plan to share.",
    steps: ["My school's need this mobility answers.", "My two learning objectives (who, what, by when).", "The course or activity and why it fits.", "How I will share it: with whom, when and in what format.", "What I will try in class in the first month.", "How we will know it made a difference."],
    materials: ["This template, printed or copied into your notes"],
    assessment: "Compare the plan with what happened two months after the mobility.",
    variation: "Coordinators can collect all plans to write the school's final report."
  }
];
const resById = id => RESOURCES.find(r => r.id === id);
