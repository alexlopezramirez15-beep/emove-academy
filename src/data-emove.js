/* ============ eMove Academy: pathways and courses (source: emoveacademy.com, October 2026) ============ */
const EMOVE_SITE = "https://www.emoveacademy.com";
const EMOVE_MAIL = "emovecourses@gmail.com";

const PATHWAYS = [
  { id: "future", name: "Future Learning", icon: "spark", color: "#1965B8", line: "AI, digital pedagogy and emerging technologies reshaping the classroom." },
  { id: "excellence", name: "Teaching Excellence", icon: "target", color: "#0E7C66", line: "Evidence-based strategies that elevate teaching craft and student outcomes." },
  { id: "wellbeing", name: "Wellbeing", icon: "heart", color: "#C2410C", line: "Nurturing teacher and student wellbeing in resilient learning communities." },
  { id: "inclusion", name: "Inclusion", icon: "hands", color: "#7C3AED", line: "Designing equitable, accessible and culturally responsive learning for all." },
  { id: "citizenship", name: "European Citizenship", icon: "stars", color: "#1D4ED8", line: "European identity, shared values, rights and democratic participation across borders." },
  { id: "leadership", name: "Leadership", icon: "compass", color: "#101C38", line: "Leading schools, departments and teams through change and innovation." },
  { id: "sustainability", name: "Sustainability", icon: "leaf", color: "#15803D", line: "Education for sustainable development and global citizenship." }
];
const pathwayById = id => PATHWAYS.find(p => p.id === id) || PATHWAYS[0];

const EMOVE_COURSES = [
  { id: "game-on", title: "GAME ON!", sub: "Turn learning into challenges, missions and experiences students want to join", pathway: "future", city: "Barcelona", dates: "5–9 July 2027", slug: "game-on" },
  { id: "ai-teacher", title: "AI Teacher 360º", sub: "Transform your teaching with ethical artificial intelligence", pathway: "future", city: "Barcelona", dates: "5–9 July 2027", slug: "ai-teachers-360-from-zero-to-hero" },
  { id: "think", title: "THINK!", sub: "Teach students how to think, not what to think", pathway: "excellence", city: "Cádiz", dates: "12–16 July 2027", slug: "think" },
  { id: "shine", title: "Every Student Can Shine", sub: "Turn learning differences into opportunities for success", pathway: "inclusion", city: "Cádiz", dates: "12–16 July 2027", slug: "every-student-can-shine" },
  { id: "outside", title: "OUTSIDE THE BOX!", sub: "Take learning beyond the classroom walls", pathway: "sustainability", city: "Asturias", dates: "19–23 July 2027", slug: "outside-the-box" },
  { id: "happy", title: "The Happy Teacher", sub: "Prevent burnout and rediscover the joy of teaching", pathway: "wellbeing", city: "Asturias", dates: "19–23 July 2027", slug: "the-happy-teacher" }
].map(c => Object.assign(c, { days: "5 days · 25 training hours", lang: "English", price: "€480", url: EMOVE_SITE + "/courses/" + c.slug }));
const courseById = id => EMOVE_COURSES.find(c => c.id === id);
/* the eMove course that continues a pathway; pathways without a course yet point to the tailor-made offer for schools */
const coursesFor = pid => EMOVE_COURSES.filter(c => c.pathway === pid);
const FOR_SCHOOLS = { title: "Tailor-made courses for your school", sub: "Group mobilities and bespoke courses designed around your school's goals", url: EMOVE_SITE + "/for-schools" };

const STAGES = ["Early childhood", "Primary", "Lower secondary", "Upper secondary", "Vocational (VET)", "Adult education", "All stages"];
const ROLES = [["teacher", "Teacher"], ["coordinator", "Erasmus+ / international coordinator"], ["head", "School leader"], ["trainer", "Teacher trainer"], ["other", "Other"]];
const COUNTRIES = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Türkiye", "Other"];

/* ---------- community ---------- */
const SPACES = [
  { id: "staffroom", name: "Staff room", icon: "users", line: "Introduce yourself and talk about teaching with colleagues from all over Europe." },
  { id: "erasmus", name: "Erasmus+ help desk", icon: "wallet", line: "Questions about applications, budgets, deadlines and reports. Teachers and the eMove team answer." },
  { id: "partners", name: "Find a partner", icon: "globe", line: "Looking for a school for eTwinning, a KA2 project or job shadowing? Post it here." },
  { id: "ideas", name: "Classroom ideas", icon: "spark", line: "Share how you used a resource, what worked and what you would change." },
  ...EMOVE_COURSES.map(c => ({ id: "course-" + c.id, name: c.title, icon: "plane", course: c.id, line: "Talk about the course, prepare your mobility and meet the teachers who are going." }))
];
const spaceById = id => SPACES.find(s => s.id === id);
const LOOKING = [["partners", "Partners for an Erasmus+ project"], ["etwinning", "An eTwinning partner"], ["shadowing", "A school for job shadowing"], ["host", "Hosting job shadowing at my school"], ["resources", "Sharing resources"], ["course-buddy", "A colleague for an eMove course"]];
const LOOKING_NAME = Object.fromEntries(LOOKING);
