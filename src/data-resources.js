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
  },
  /* ---------- resources made for each eMove course (connected to a day of its syllabus) ---------- */
  {
    id: "mission-builder", title: "Mission builder: from exercise to mission", pathway: "future", type: "Template", stages: ["All stages"], minutes: 20,
    summary: "Five questions that turn any worksheet into a mission students understand and want to complete.",
    objective: "Teachers redesign an ordinary task so it has a purpose, a challenge and a clear finish line, without changing the learning objective.",
    steps: ["Write the learning objective of the task in one sentence. It must not change.", "Purpose: what problem, mystery or goal gives the task a reason to exist? Write it as one line to read aloud.", "Challenge: add one constraint (time, resources, a rule) that makes it interesting, not impossible.", "Feedback: how will teams know straight away that they are on track (a code, a check, a peer)?", "Finish line: what does 'mission complete' look like and how is it celebrated?", "Test it with a colleague in five minutes and simplify anything that needs explaining twice."],
    materials: ["One worksheet or exercise you already use", "This template"],
    assessment: "Compare participation and completion with the last time you used the worksheet.",
    variation: "Let teams choose between two missions with the same objective."
  },
  {
    id: "progress-map", title: "A progress map without leaderboards", pathway: "future", type: "Template", stages: ["Primary", "Lower secondary", "Upper secondary"], minutes: 30,
    summary: "Make progress visible for the whole class with a shared map, without ranking students against each other.",
    objective: "Students see how far they have come and work towards a shared goal instead of competing.",
    steps: ["Draw a map with 5–8 stops: each stop is a learning milestone of the unit.", "Decide what unlocks each stop (a task, a quiz, a product) and write it next to the stop.", "Move one class token when the whole class reaches a milestone, not individual names.", "Give each student a private mini-map to track their own route.", "At each stop, take two minutes to celebrate and ask: what helped us get here?", "At the last stop, unlock something the class chose at the start."],
    materials: ["A large poster or a slide", "A class token", "Printed mini-maps"],
    assessment: "Use the private mini-maps to spot who needs support before the next stop.",
    variation: "Add optional side quests for students who want extra challenge."
  },
  {
    id: "prompt-builder", title: "The five-part prompt builder", pathway: "future", type: "Template", stages: ["All stages"], minutes: 15,
    summary: "Role, context, task, constraints and format: a simple frame for better results from AI tools.",
    objective: "Teachers write prompts that give useful, accurate and age-appropriate material, and improve them by iterating.",
    steps: ["Role: tell the tool who it should act as (e.g. 'an experienced primary science teacher').", "Context: your students' age, level, needs and what they already know.", "Task: exactly what you want (a story, five questions, a rubric, three versions of a text).", "Constraints: length, vocabulary, what to avoid, curriculum links.", "Format: a table, a list, a script, a worksheet layout.", "Read the answer critically, then ask one follow-up to improve it. Never use the first version without checking it."],
    materials: ["An AI tool allowed by your school", "This template"],
    assessment: "Use the checklist: accurate, appropriate, useful for my class? If one is no, iterate.",
    variation: "Build a shared prompt bank with your department."
  },
  {
    id: "ai-agreement", title: "Classroom AI agreement", pathway: "future", type: "Template", stages: ["Lower secondary", "Upper secondary", "Vocational (VET)", "Adult education"], minutes: 45,
    summary: "Students and teacher agree together when AI can help, when it can't, and how to say they used it.",
    objective: "Students learn to use AI responsibly and keep their own thinking at the centre of their work.",
    steps: ["Ask students how they already use AI. Collect answers without judging.", "Sort tasks into three columns: AI can help, AI with care, no AI. Discuss the borderline cases.", "Agree on how to declare AI use in a piece of work (one sentence at the end).", "Add one rule about privacy: no personal data in AI tools.", "Write the agreement on one page and everyone signs it.", "Review it after a month: what worked, what needs to change?"],
    materials: ["Sticky notes in three colours", "A large sheet for the final agreement"],
    assessment: "Check that declared AI use matches the agreement in the next assignment.",
    variation: "With younger students, focus on one rule: 'AI suggests, I decide'."
  },
  {
    id: "cer-template", title: "Claim, evidence, reasoning", pathway: "excellence", type: "Template", stages: ["Primary", "Lower secondary", "Upper secondary", "Vocational (VET)"], minutes: 30,
    summary: "A three-box frame that helps students move from opinion to an argument they can defend.",
    objective: "Students support a claim with evidence and explain how the evidence supports it.",
    steps: ["Give a question with more than one possible answer (Is this source reliable? Which material is best?).", "Claim: students write their answer in one sentence.", "Evidence: they list two or three facts, data or quotes that support it.", "Reasoning: they explain why the evidence supports the claim ('This shows that… because…').", "Pairs swap and ask one 'How do you know?' question.", "Students revise the claim if the evidence is weak. Changing your mind counts as good thinking."],
    materials: ["The three-box frame on paper or a slide", "Sources or data for the question"],
    assessment: "Assess the reasoning box: does it connect evidence and claim, or just repeat them?",
    variation: "Add a fourth box: 'What would change my mind?'"
  },
  {
    id: "decision-matrix", title: "Decision matrix for real dilemmas", pathway: "excellence", type: "Activity", stages: ["Lower secondary", "Upper secondary", "Vocational (VET)", "Adult education"], minutes: 50,
    summary: "Teams compare options against criteria they choose, decide, and defend their reasoning.",
    objective: "Students make a defensible decision when there is no single correct answer.",
    steps: ["Present a dilemma connected to your subject (where to build a park, which energy source, what a character should do).", "Teams list three options.", "They choose four criteria and give each a weight from 1 to 3.", "They score every option against every criterion and add up the totals.", "They look at the result: do they agree with it? If not, which criterion is missing?", "Each team presents its decision and the strongest argument against it."],
    materials: ["A matrix grid", "Information cards for the dilemma"],
    assessment: "Look for justified weights and honest counter-arguments, not the 'right' option.",
    variation: "Give each team member a different stakeholder role."
  },
  {
    id: "barrier-hunt", title: "Barrier hunt: audit one activity", pathway: "inclusion", type: "Template", stages: ["All stages"], minutes: 25,
    summary: "A checklist to find the invisible barriers inside an ordinary classroom activity.",
    objective: "Teachers change what is around the learner before asking the learner to change.",
    steps: ["Pick one activity you will teach this week.", "Instructions: are they short, visual and available after you say them?", "Reading and writing: could a student show the learning without long texts?", "Attention and time: is there a break, a timer, a clear first step?", "Environment: noise, light, visual overload, where students sit.", "Participation: can every student take part without being put on the spot?", "Change one thing for everyone, then teach the activity and notice who joined in."],
    materials: ["The activity you want to audit", "This checklist"],
    assessment: "Note which students participated more after the change.",
    variation: "Do the hunt in pairs with a colleague from another subject."
  },
  {
    id: "scaffold-ladder", title: "The scaffolding ladder", pathway: "inclusion", type: "Template", stages: ["All stages"], minutes: 20,
    summary: "Plan support in steps, from the lightest to the strongest, and remove it as students grow.",
    objective: "Every student gets the smallest support they need to move forward, with high expectations for all.",
    steps: ["Write the task at the top of the ladder: the same goal for everyone.", "Step 1 (light): a checklist or success criteria.", "Step 2: a worked example or a model answer.", "Step 3: the task in chunks with a visual organiser.", "Step 4 (strong): guided practice with you or a peer.", "Students choose or are guided to a step, and try to climb down next time."],
    materials: ["The ladder template", "One example and one organiser for the task"],
    assessment: "Record which step each student used and aim for a lighter step next time.",
    variation: "Let students design the ladder for a younger class."
  },
  {
    id: "hundred-metre", title: "The 100-metre classroom", pathway: "sustainability", type: "Activity", stages: ["All stages"], minutes: 50,
    summary: "Discover how many learning opportunities fit in a circle of 100 metres around your school.",
    objective: "Students and teachers see the school surroundings as a resource for every subject.",
    steps: ["Agree the boundaries and safety rules before going out.", "Teams receive a map with a 100-metre circle around the school.", "Each team has 20 minutes to find learning in five subjects (numbers, materials, signs, history, living things).", "They photograph or sketch each find and note the subject.", "Back inside, teams share and the class builds a map of learning spots.", "Choose one spot for a lesson next week."],
    materials: ["Printed map with the circle", "Clipboards", "A phone or tablet per team (optional)"],
    assessment: "Count how many subjects each team connected and ask them to explain one find.",
    variation: "Repeat it in another season and compare what changed."
  },
  {
    id: "outdoor-mission", title: "Outdoor mission card", pathway: "sustainability", type: "Template", stages: ["Primary", "Lower secondary", "Upper secondary"], minutes: 40,
    summary: "A one-card format to turn any outdoor visit into an inquiry with a real learning objective.",
    objective: "Students go outside to investigate a question, collect evidence and bring the learning back to class.",
    steps: ["Question: one question the place can answer ('Where is the warmest spot in the playground and why?').", "Role: explorers, researchers, mappers or reporters.", "Collect: what evidence they bring back (measurements, photos, sketches, interviews).", "Boundaries: where they can go, time limit and meeting point.", "Bring it back: how they will share the answer (map, short talk, poster).", "Reflect: one thing they discovered that they didn't expect."],
    materials: ["Printed mission cards", "Measuring tools or phones, depending on the mission"],
    assessment: "Assess the evidence collected and the explanation, not the outing itself.",
    variation: "Students write mission cards for another class."
  },
  {
    id: "stop-simplify", title: "Stop, simplify, delegate, protect", pathway: "wellbeing", type: "Template", stages: ["All stages"], minutes: 20,
    summary: "A quick workload audit to decide what deserves your energy this term.",
    objective: "Teachers reduce unnecessary workload and protect the tasks that matter most.",
    steps: ["List everything you do in a normal week, including the invisible tasks.", "Stop: what could you stop doing without harming students?", "Simplify: what could take half the time (shorter feedback, templates, shared plans)?", "Delegate or share: what could students, colleagues or a team do?", "Protect: which two tasks give you and your students the most value? Block time for them.", "Choose one change for next week and check how it went."],
    materials: ["This template", "Your weekly timetable"],
    assessment: "After two weeks, note the time and energy you gained.",
    variation: "Do it as a department to find shared savings."
  },
  {
    id: "bad-day-toolkit", title: "My bad day toolkit", pathway: "wellbeing", type: "Template", stages: ["All stages"], minutes: 15,
    summary: "Not a perfect-day routine: a short list of what helps you recover when things go wrong.",
    objective: "Teachers prepare realistic strategies for difficult days before they happen.",
    steps: ["Write three signs that tell you a day is going badly (body, thoughts, behaviour).", "Two-minute resets you can do at school: breathing, a walk, water, a window.", "One person you can talk to and how you will ask for help.", "One thing you will not do on a bad day (answer emails at night, mark everything).", "One small thing that reminds you why you teach.", "Keep the card somewhere you will see it and update it each term."],
    materials: ["An index card or a note on your phone"],
    assessment: "Use it on the next difficult day and note what helped most.",
    variation: "Create a staff room version together with colleagues."
  }
];
const resById = id => RESOURCES.find(r => r.id === id);
/* the eMove course each resource prepares for, and the day of its syllabus it connects to */
const RES_COURSE = {
  "mission-escape": ["game-on", 2], "mission-builder": ["game-on", 2], "progress-map": ["game-on", 4],
  "ai-feedback-check": ["ai-teacher", 4], "prompt-builder": ["ai-teacher", 2], "ai-agreement": ["ai-teacher", 4],
  "think-routine": ["think", 1], "exit-ticket": ["think", 5], "cer-template": ["think", 2], "decision-matrix": ["think", 4],
  "udl-menu": ["shine", 3], "strengths-cards": ["shine", 5], "barrier-hunt": ["shine", 2], "scaffold-ladder": ["shine", 4],
  "school-grounds": ["outside", 2], "waste-audit": ["outside", 3], "hundred-metre": ["outside", 1], "outdoor-mission": ["outside", 3],
  "staff-wellbeing": ["happy", 1], "calm-corner": ["happy", 4], "stop-simplify": ["happy", 2], "bad-day-toolkit": ["happy", 4]
};
RESOURCES.forEach(r => { const c = RES_COURSE[r.id]; if (c) { r.course = c[0]; r.day = c[1]; } });
const resForCourse = (cid, day) => RESOURCES.filter(r => r.course === cid && (!day || r.day === day));
