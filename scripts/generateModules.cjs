const fs = require('fs');

const sourcePath = 'public/sourcedata.txt';
const dataDir = 'public/data';

const text = fs.readFileSync(sourcePath, 'utf8');
const moduleRegex = /Module\s+(\d+):\s*(.+?)\n([\s\S]*?)(?=\nModule\s+\d+:|$)/g;
let match;
let count = 0;

while ((match = moduleRegex.exec(text)) !== null) {
  const number = match[1].padStart(2, '0');
  const title = match[2].trim();
  let body = match[3].trim();

  const obj = {
    module_id: `M${number}`,
    module_number: number,
    module_title: title,
    learning_objectives: [],
    key_focus_areas: [],
    key_terms: [],
  };

  const lines = body.split(/\r?\n/);
  let currentList = null;
  const remaining = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^Learning Objectives:/i.test(trimmed)) {
      currentList = 'learning_objectives';
      continue;
    }
    if (/^Key Focus Areas:/i.test(trimmed)) {
      currentList = 'key_focus_areas';
      continue;
    }
    if (/^Key Terms:/i.test(trimmed)) {
      currentList = 'key_terms';
      continue;
    }
    if (/^[\u2022\-*]/.test(trimmed) && currentList) {
      obj[currentList].push(trimmed.replace(/^[\u2022\-*]\s*/, ''));
      continue;
    }
    if (trimmed === '') {
      currentList = null;
      remaining.push('');
    } else {
      currentList = null;
      remaining.push(line);
    }
  }

  obj.sections = [
    {
      section_id: `M${number}-S1`,
      title: title,
      content: remaining.join('\n').trim(),
    },
  ];

  fs.writeFileSync(`${dataDir}/module_${number}.json`, JSON.stringify(obj, null, 2));
  count++;
}

console.log(`Generated ${count} modules`);
