import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsPath = path.join(__dirname, '../public/data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

const questions = data.questions;
console.log(`Total questions: ${questions.length}`);

// 問題文の重複をチェック
const questionTextMap = new Map();
const duplicates = [];

questions.forEach((q, index) => {
  const text = q.question.trim();

  if (questionTextMap.has(text)) {
    duplicates.push({
      text: text,
      first: questionTextMap.get(text),
      duplicate: {
        index: index,
        id: q.id,
        level: q.level,
        category: q.category
      }
    });
  } else {
    questionTextMap.set(text, {
      index: index,
      id: q.id,
      level: q.level,
      category: q.category
    });
  }
});

console.log(`\nUnique question texts: ${questionTextMap.size}`);
console.log(`Duplicate question texts found: ${duplicates.length}`);

if (duplicates.length > 0) {
  console.log('\n=== Duplicate Questions ===\n');
  duplicates.forEach((dup, i) => {
    console.log(`\n[Duplicate #${i + 1}]`);
    console.log(`Question: "${dup.text.substring(0, 50)}..."`);
    console.log(`First occurrence: ID=${dup.first.id}, Level=${dup.first.level}, Category=${dup.first.category}`);
    console.log(`Duplicate: ID=${dup.duplicate.id}, Level=${dup.duplicate.level}, Category=${dup.duplicate.category}`);
  });
}

// 問題IDの重複もチェック
const idMap = new Map();
const idDuplicates = [];

questions.forEach((q, index) => {
  if (idMap.has(q.id)) {
    idDuplicates.push({
      id: q.id,
      first: idMap.get(q.id),
      duplicate: index
    });
  } else {
    idMap.set(q.id, index);
  }
});

console.log(`\n\n=== ID Duplicates ===`);
console.log(`Duplicate IDs found: ${idDuplicates.length}`);

if (idDuplicates.length > 0) {
  idDuplicates.forEach((dup) => {
    console.log(`ID "${dup.id}" appears at indices: ${dup.first}, ${dup.duplicate}`);
  });
}
