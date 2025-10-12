#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重複問題削除スクリプト
q488（桓武天皇・平安京問題）を削除し、IDを再採番
"""

import json
from pathlib import Path

def remove_duplicate_question():
    """重複問題q488を削除"""
    
    # questions.jsonを読み込み
    json_path = Path(__file__).parent.parent / "public" / "data" / "questions.json"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['questions']
    
    print(f"削除前の問題数: {len(questions)}")
    
    # q488を削除
    questions_filtered = [q for q in questions if q['id'] != 'q488']
    
    print(f"削除後の問題数: {len(questions_filtered)}")
    
    # 削除された問題の情報を表示
    removed_question = [q for q in questions if q['id'] == 'q488']
    if removed_question:
        q = removed_question[0]
        print(f"\n削除された問題:")
        print(f"  ID: {q['id']}")
        print(f"  問題: {q['question']}")
        print(f"  理由: 既存のq001と重複")
    
    # IDを再採番（q488以降のIDを1つ繰り上げ）
    print(f"\nIDの再採番中...")
    
    for i, question in enumerate(questions_filtered):
        original_id = question['id']
        
        if question['id'].startswith('q'):
            id_num = int(question['id'][1:])
            
            # q488以降のIDを1つ繰り上げ
            if id_num > 488:
                new_id_num = id_num - 1
                question['id'] = f"q{new_id_num:03d}"
                
                if original_id != question['id']:
                    print(f"  {original_id} → {question['id']}")
    
    # 更新されたデータを保存
    updated_data = {"questions": questions_filtered}
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(updated_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 重複問題削除完了")
    print(f"最終問題数: {len(questions_filtered)}問")
    
    # 統計情報更新
    level_stats = {}
    for q in questions_filtered:
        level_key = q["level"] + "_" + q["exam-year"]
        level_stats[level_key] = level_stats.get(level_key, 0) + 1
    
    print("\n更新後の統計:")
    for key, count in sorted(level_stats.items()):
        level, year = key.split('_', 1)
        print(f"  {level} {year}: {count}問")
    
    return len(questions_filtered)

if __name__ == "__main__":
    remove_duplicate_question()