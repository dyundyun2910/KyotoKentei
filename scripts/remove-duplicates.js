import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsPath = path.join(__dirname, '../public/data/questions.json');
const data = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

const questions = data.questions;
console.log(`Total questions before: ${questions.length}`);

// 問題文をキーとして、最初に出現した問題のみを保持
const seenTexts = new Map();
const uniqueQuestions = [];

questions.forEach((q) => {
  const text = q.question.trim();

  if (!seenTexts.has(text)) {
    seenTexts.set(text, true);
    uniqueQuestions.push(q);
  } else {
    console.log(`Removing duplicate: ID=${q.id}, Level=${q.level}, Category=${q.category}`);
  }
});

console.log(`\nTotal questions after: ${uniqueQuestions.length}`);
console.log(`Removed: ${questions.length - uniqueQuestions.length} duplicates`);

// バックアップを作成
const backupPath = path.join(__dirname, '../public/data/questions.backup.json');
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\nBackup created at: ${backupPath}`);

// 重複を削除したデータを保存
data.questions = uniqueQuestions;
fs.writeFileSync(questionsPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Updated file saved at: ${questionsPath}`);
