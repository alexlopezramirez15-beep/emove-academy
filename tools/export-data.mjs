/* Dumps the content of src/data-*.js to JSON for the public website generator (web/website.py). */
import { readFileSync } from "node:fs";
import vm from "node:vm";

const root = new URL("..", import.meta.url).pathname;
const ctx = {};
vm.createContext(ctx);
for (const f of ["data-emove.js", "data-course.js", "data-resources.js"]) vm.runInContext(readFileSync(root + "src/" + f, "utf8"), ctx);
const out = vm.runInContext("({ PATHWAYS, EMOVE_COURSES, RESOURCES, COURSE: COURSES[0] })", ctx);
process.stdout.write(JSON.stringify(out));
