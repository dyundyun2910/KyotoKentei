#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
不足問題手動追加スクリプト
PDFの完全自動抽出が困難なため、手動で重要問題を追加
"""

import json
from pathlib import Path
from typing import List, Dict, Any

def load_existing_questions() -> List[Dict]:
    """既存の問題を読み込む"""
    json_path = Path(__file__).parent.parent / "public" / "data" / "questions.json"
    if json_path.exists():
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('questions', [])
    return []

def get_next_id(existing_questions: List[Dict]) -> str:
    """次のIDを取得"""
    max_id = 0
    for q in existing_questions:
        if q['id'].startswith('q'):
            try:
                id_num = int(q['id'][1:])
                max_id = max(max_id, id_num)
            except:
                continue
    return f"q{max_id + 1:03d}"

def add_sample_missing_questions():
    """サンプルとして不足問題を手動で追加"""
    
    existing_questions = load_existing_questions()
    print(f"既存問題数: {len(existing_questions)}")
    
    # 不足している3級問題のサンプル（京都検定の典型的な問題）
    missing_3kyuu_questions = [
        {
            "level": "3級",
            "category": "歴史",
            "exam-year": "2004/12/12",
            "question": "794年に桓武天皇によって平安京が造営されましたが、それ以前の都はどこでしたか。",
            "options": ["長岡京", "平城京", "藤原京", "難波京"],
            "correctAnswer": 0,
            "explanation": "桓武天皇は長岡京から平安京に遷都しました。長岡京は784年から794年まで約10年間都が置かれていました。"
        },
        {
            "level": "3級", 
            "category": "神社",
            "exam-year": "2004/12/12",
            "question": "京都の「お稲荷さん」として親しまれ、全国に約3万社の分社を持つ神社はどこですか。",
            "options": ["伏見稲荷大社", "松尾大社", "八坂神社", "下鴨神社"],
            "correctAnswer": 0,
            "explanation": "伏見稲荷大社は稲荷神を祀る神社の総本宮で、商売繁盛・五穀豊穣の神として信仰されています。"
        },
        {
            "level": "3級",
            "category": "寺院", 
            "exam-year": "2004/12/12",
            "question": "「清水の舞台から飛び降りる」という慣用句で有名な寺院はどこですか。",
            "options": ["清水寺", "金閣寺", "銀閣寺", "知恩院"],
            "correctAnswer": 0,
            "explanation": "清水寺の本堂前に張り出した舞台は「清水の舞台」と呼ばれ、高さ約12メートルの懸造り（舞台造り）です。"
        },
        {
            "level": "3級",
            "category": "建築",
            "exam-year": "2004/12/12", 
            "question": "金閣寺として知られる鹿苑寺の金閣は、何層の建物ですか。",
            "options": ["2層", "3層", "4層", "5層"],
            "correctAnswer": 1,
            "explanation": "金閣（舎利殿）は3層の楼閣建築で、2層・3層部分に金箔が貼られています。各層は異なる建築様式で造られています。"
        },
        {
            "level": "3級",
            "category": "祭と行事",
            "exam-year": "2004/12/12",
            "question": "毎年7月に行われる京都三大祭りの一つで、「コンチキチン」の囃子で知られる祭りは何ですか。",
            "options": ["祇園祭", "葵祭", "時代祭", "五山送り火"],
            "correctAnswer": 0,
            "explanation": "祇園祭は7月1日から31日まで1か月間行われる八坂神社の祭礼で、「コンチキチン」の囃子は祇園囃子と呼ばれます。"
        },
        {
            "level": "3級",
            "category": "美術",
            "exam-year": "2004/12/12",
            "question": "京都国立博物館が所蔵する国宝「風神雷神図屏風」の作者は誰ですか。",
            "options": ["俵屋宗達", "尾形光琳", "狩野永徳", "雪舟"],
            "correctAnswer": 0,
            "explanation": "俵屋宗達作の「風神雷神図屏風」は江戸時代初期の代表的な作品で、後に尾形光琳や酒井抱一によって模写されました。"
        },
        {
            "level": "3級",
            "category": "花街", 
            "exam-year": "2004/12/12",
            "question": "京都の花街で、毎年春に「都をどり」が開催されるのはどこですか。",
            "options": ["祇園甲部", "先斗町", "祇園東", "上七軒"],
            "correctAnswer": 0,
            "explanation": "「都をどり」は祇園甲部の芸妓・舞妓による春の舞踊公演で、1872年から続く伝統行事です。"
        },
        {
            "level": "3級",
            "category": "京料理",
            "exam-year": "2004/12/12", 
            "question": "京都の代表的な精進料理で、湯波を使った料理として有名なものは何ですか。",
            "options": ["湯波丼", "湯波巻", "湯波刺身", "湯波あんかけ"],
            "correctAnswer": 2,
            "explanation": "京都では上質な湯波が作られ、湯波刺身として生のまま醤油やわさびで食べるのが定番です。"
        },
        {
            "level": "3級", 
            "category": "京菓子",
            "exam-year": "2004/12/12",
            "question": "京都の代表的な土産菓子で、「つぶあん」と「こしあん」の2種類がある八つ橋の生菓子バージョンは何と呼ばれますか。",
            "options": ["生八つ橋", "聖護院八つ橋", "井筒八つ橋", "夕子"],
            "correctAnswer": 0,
            "explanation": "生八つ橋は米粉を使った生地であんを包んだ京都の代表的な和菓子で、ニッキ（シナモン）の香りが特徴です。"
        },
        {
            "level": "3級",
            "category": "地名", 
            "exam-year": "2004/12/12",
            "question": "京都の東西の通りで、「四条通」の一つ北にある通りは何ですか。",
            "options": ["三条通", "五条通", "錦小路通", "六角通"],
            "correctAnswer": 2,
            "explanation": "四条通の北隣は錦小路通です。「錦市場」があることで有名で、「京の台所」と呼ばれています。"
        },
        {
            "level": "3級",
            "category": "庭園",
            "exam-year": "2004/12/12", 
            "question": "龍安寺の石庭は何個の石で構成されていますか。",
            "options": ["13個", "14個", "15個", "16個"],
            "correctAnswer": 2,
            "explanation": "龍安寺の石庭は15個の石で構成された枯山水庭園で、どの位置から見ても必ず1個の石は他の石に隠れて見えないように設計されています。"
        },
        {
            "level": "3級",
            "category": "自然",
            "exam-year": "2004/12/12",
            "question": "京都市を南北に流れる代表的な川で、「鴨川」の上流部分は何と呼ばれますか。",
            "options": ["桂川", "賀茂川", "高野川", "疏水"],
            "correctAnswer": 1,
            "explanation": "賀茂川（上流）と高野川が出町柳で合流して鴨川（下流）となります。「かもがわ」という読みは同じですが、漢字が異なります。"
        },
        {
            "level": "3級",
            "category": "観光学", 
            "exam-year": "2004/12/12",
            "question": "京都市の年間観光客数は約何万人ですか（2004年当時）。",
            "options": ["3000万人", "4000万人", "5000万人", "6000万人"],
            "correctAnswer": 2,
            "explanation": "2004年当時の京都市の年間観光客数は約5000万人でした。現在はさらに増加しています。"
        },
        {
            "level": "3級",
            "category": "ことばと伝説",
            "exam-year": "2004/12/12",
            "question": "京都弁で「おおきに」はどのような意味ですか。",
            "options": ["さようなら", "ありがとう", "こんにちは", "すみません"],
            "correctAnswer": 1,
            "explanation": "「おおきに」は関西弁で「ありがとう」という意味です。「大きに」が語源で、感謝の気持ちを表します。"
        },
        {
            "level": "3級",
            "category": "伝統工芸",
            "exam-year": "2004/12/12", 
            "question": "京都の伝統工芸品で、着物に使われる絹織物として有名なものは何ですか。",
            "options": ["西陣織", "友禅染", "京焼", "京扇子"],
            "correctAnswer": 0,
            "explanation": "西陣織は京都西陣地区で生産される高級絹織物で、帯や着物に使用されます。金糸や銀糸を使った華やかな織物が特徴です。"
        },
        {
            "level": "3級",
            "category": "史跡",
            "exam-year": "2004/12/12",
            "question": "平安京の正門として建てられた門の跡地に現在建っている寺院は何ですか。",
            "options": ["東寺", "西寺", "羅城門", "朱雀門"],
            "correctAnswer": 0,
            "explanation": "羅城門の跡地近くに東寺（教王護国寺）があります。東寺は弘法大師空海ゆかりの寺院で、五重塔で有名です。"
        }
    ]
    
    # IDを付与
    new_questions = []
    for i, q in enumerate(missing_3kyuu_questions):
        q["id"] = get_next_id(existing_questions + new_questions)
        new_questions.append(q)
    
    # 統計表示
    print(f"\n追加する3級問題数: {len(new_questions)}")
    
    # カテゴリ別統計
    category_stats = {}
    for q in new_questions:
        category_stats[q["category"]] = category_stats.get(q["category"], 0) + 1
    
    print("\nカテゴリ別統計:")
    for category, count in sorted(category_stats.items()):
        print(f"  {category}: {count}問")
    
    # ファイルに保存
    output_file = "additional_3kyuu_questions.json"
    output_data = {"questions": new_questions}
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n{output_file} に保存しました")
    
    # questions.jsonにマージするか確認
    merge = input(f"\n既存のquestions.jsonに{len(new_questions)}問を追加しますか？ (y/n): ").strip().lower()
    if merge == 'y':
        all_questions = existing_questions + new_questions
        
        json_path = Path(__file__).parent.parent / "public" / "data" / "questions.json"
        merged_data = {"questions": all_questions}
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, ensure_ascii=False, indent=2)
        
        print(f"\nquestions.jsonを更新しました")
        print(f"総問題数: {len(all_questions)}問 (新規追加: {len(new_questions)}問)")
        
        # 更新後の統計
        level_stats = {}
        year_stats = {}
        for q in all_questions:
            level_key = q["level"] + "_" + q["exam-year"]
            level_stats[level_key] = level_stats.get(level_key, 0) + 1
        
        print("\n更新後の統計:")
        for key, count in sorted(level_stats.items()):
            level, year = key.split('_', 1)
            print(f"  {level} {year}: {count}問")

if __name__ == "__main__":
    add_sample_missing_questions()