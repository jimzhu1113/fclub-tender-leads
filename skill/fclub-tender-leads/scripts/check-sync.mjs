import { execFileSync } from 'node:child_process';

const allowed = new Set([
  '.gitignore', 'AGENTS.MD',
  'skill/fclub-tender-leads/SKILL.md',
  'skill/fclub-tender-leads/agents/openai.yaml',
  'skill/fclub-tender-leads/scripts/tender-workflow.mjs',
  'skill/fclub-tender-leads/scripts/tender-workflow.test.mjs',
  'skill/fclub-tender-leads/scripts/check-sync.mjs',
]);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const mode = process.argv[2];
if (!['--staged', '--outgoing'].includes(mode)) throw new Error('Use --staged or --outgoing');
if (git('branch', '--show-current') !== 'main') throw new Error('Sync requires main');
if (!/^https:\/\/github\.com\/jimzhu1113\/fclub-tender-leads(?:\.git)?$/.test(git('remote', 'get-url', 'origin'))) {
  throw new Error('Unexpected origin; do not push');
}
let files;
if (mode === '--staged') {
  files = git('diff', '--cached', '--name-only', '--no-renames', '-z').split('\0');
} else {
  git('rev-parse', '--verify', 'origin/main');
  // Inspect every outgoing commit, including files added and later removed.
  const commits = git('rev-list', 'origin/main..HEAD').split('\n').filter(Boolean);
  files = commits.flatMap(id => git('diff-tree', '--root', '-m', '--no-commit-id', '--name-only', '--no-renames', '-r', '-z', id).split('\0'));
}
const denied = [...new Set(files.filter(file => file && !allowed.has(file)))];
if (denied.length) throw new Error(`Upload blocked: ${denied.join(', ')}`);
console.log(`Allowlist passed (${mode}): ${new Set(files.filter(Boolean)).size} approved paths. Review file contents for private data before pushing.`);
