import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsPath = path.join(__dirname, '../public/data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

const questions = data.questions;
console.log(`Total questions: ${questions.length}`);

// IDを連番に振り直し
questions.forEach((q, index) => {
  const oldId = q.id;
  const newId = `q${String(index + 1).padStart(3, '0')}`;
  q.id = newId;

  if ((index + 1) % 50 === 0) {
    console.log(`Renumbered ${index + 1} questions...`);
  }
});

console.log(`\nAll ${questions.length} questions renumbered to q001-q${String(questions.length).padStart(3, '0')}`);

// ファイルに保存
fs.writeFileSync(questionsPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Updated file saved at: ${questionsPath}`);
