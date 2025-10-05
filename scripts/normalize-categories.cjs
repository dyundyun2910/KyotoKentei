const fs = require('fs');

// カテゴリ正規化マッピング
const categoryMapping = {
  // 正式カテゴリ（そのまま）
  '歴史': '歴史',
  '史跡': '史跡',
  '神社': '神社',
  '寺院': '寺院',
  '建築': '建築',
  '庭園': '庭園',
  '美術': '美術',
  '伝統工芸': '伝統工芸',
  '伝統文化': '伝統文化',
  '花街': '花街',
  '祭と行事': '祭と行事',
  '京料理': '京料理',
  '京菓子': '京菓子',
  'ならわし': 'ならわし',
  'ことばと伝説': 'ことばと伝説',
  '地名': '地名',
  '自然': '自然',
  '観光学': '観光学',

  // 表記ゆれの統一
  '神 社': '神社',
  '祭り': '祭と行事',
  '祭り・行事': '祭と行事',
  '祭事・行事': '祭と行事',

  // 複合カテゴリの統一（優先順位: 最初のカテゴリ）
  '歴史・史跡': '歴史',
  '歴史、史跡': '歴史',
  '社寺': '寺院',
  '神社、寺院': '神社',
  '建築・庭園': '建築',
  '庭園・建築': '庭園',
  '建築、庭園、美術': '建築',
  '美術・文学': '美術',
  '美術・伝統工芸': '美術',
  '京料理・京菓子': '京料理',
  '花街・祇園祭': '花街',

  // その他の表記ゆれ
  '地理・地名': '地名',
  '地理・街路': '地名',
  '地域・地名': '地名',
  '食文化': '京料理',
  '慣習・文化': 'ならわし',
};

// questions.jsonを読み込み
const data = JSON.parse(fs.readFileSync('public/data/questions.json', 'utf8'));

// 統計情報
const stats = {
  total: data.questions.length,
  changed: 0,
  unchanged: 0,
  categories: {}
};

// カテゴリを正規化
data.questions.forEach((q, index) => {
  const originalCategory = q.category;
  const normalizedCategory = categoryMapping[originalCategory] || originalCategory;

  if (originalCategory !== normalizedCategory) {
    console.log(`[${index + 1}] ${q.id}: "${originalCategory}" → "${normalizedCategory}"`);
    q.category = normalizedCategory;
    stats.changed++;
  } else {
    stats.unchanged++;
  }

  // カテゴリ別統計
  stats.categories[normalizedCategory] = (stats.categories[normalizedCategory] || 0) + 1;
});

// 結果を保存
fs.writeFileSync(
  'public/data/questions.json',
  JSON.stringify(data, null, 2),
  'utf8'
);

// 統計情報を表示
console.log('\n=== Category Normalization Complete ===');
console.log(`Total questions: ${stats.total}`);
console.log(`Changed: ${stats.changed}`);
console.log(`Unchanged: ${stats.unchanged}`);
console.log('\n=== Categories Distribution ===');
Object.entries(stats.categories)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

console.log('\n✓ File saved: public/data/questions.json');
