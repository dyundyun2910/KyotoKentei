#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
問題重複チェックスクリプト
追加された問題と既存問題の意味的重複を検証
"""

import json
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple
from difflib import SequenceMatcher

def load_json_file(file_path: str) -> List[Dict]:
    """JSONファイルから問題を読み込み"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('questions', [])
    except FileNotFoundError:
        print(f"ファイルが見つかりません: {file_path}")
        return []

def normalize_text(text: str) -> str:
    """テキストを正規化（比較用）"""
    # 全角・半角統一、記号除去、空白除去
    text = re.sub(r'[（）()【】「」『』\s]', '', text)
    text = text.replace('？', '').replace('?', '')
    text = text.replace('。', '').replace('、', '')
    return text.lower()

def extract_key_terms(question: str) -> Set[str]:
    """問題文からキーワードを抽出"""
    # 重要なキーワードパターン
    patterns = [
        r'[年代]\d+年',  # 年代
        r'[平鎌室江明大昭]\w+時代',  # 時代名
        r'\w+[寺院神社]',  # 寺社名
        r'\w+[天皇将軍]',  # 人物
        r'\w+[祭り祭]',  # 祭り
        r'\w+[通り道]',  # 地名
        r'\w+[織焼]',  # 工芸品
    ]
    
    terms = set()
    text = question
    
    # パターンマッチング
    for pattern in patterns:
        matches = re.findall(pattern, text)
        terms.update(matches)
    
    # 重要な固有名詞を抽出（カタカナ、漢字の連続）
    proper_nouns = re.findall(r'[ア-ヲ]{2,}|[一-龯]{2,}', text)
    terms.update([noun for noun in proper_nouns if len(noun) >= 2])
    
    return terms

def calculate_similarity(q1: Dict, q2: Dict) -> Tuple[float, str]:
    """2つの問題の類似度を計算"""
    
    # 問題文の類似度
    text1 = normalize_text(q1['question'])
    text2 = normalize_text(q2['question'])
    text_similarity = SequenceMatcher(None, text1, text2).ratio()
    
    # キーワードの重複度
    terms1 = extract_key_terms(q1['question'])
    terms2 = extract_key_terms(q2['question'])
    
    if len(terms1) == 0 and len(terms2) == 0:
        keyword_similarity = 0.0
    else:
        common_terms = terms1 & terms2
        total_terms = terms1 | terms2
        keyword_similarity = len(common_terms) / len(total_terms) if total_terms else 0.0
    
    # 選択肢の類似度
    options1 = set(normalize_text(opt) for opt in q1['options'])
    options2 = set(normalize_text(opt) for opt in q2['options'])
    
    if len(options1) == 0 and len(options2) == 0:
        option_similarity = 0.0
    else:
        common_options = options1 & options2
        total_options = options1 | options2
        option_similarity = len(common_options) / len(total_options) if total_options else 0.0
    
    # 総合類似度（重み付け平均）
    total_similarity = (
        text_similarity * 0.5 +
        keyword_similarity * 0.3 +
        option_similarity * 0.2
    )
    
    # 類似の理由
    reasons = []
    if text_similarity > 0.6:
        reasons.append(f"問題文類似度: {text_similarity:.2f}")
    if keyword_similarity > 0.5:
        reasons.append(f"キーワード重複: {keyword_similarity:.2f}")
        if len(terms1 & terms2) > 0:
            reasons.append(f"共通キーワード: {', '.join(list(terms1 & terms2)[:3])}")
    if option_similarity > 0.5:
        reasons.append(f"選択肢重複: {option_similarity:.2f}")
    
    reason = " | ".join(reasons) if reasons else "類似度低"
    
    return total_similarity, reason

def check_duplicates_comprehensive():
    """包括的な重複チェック"""
    
    # 既存の問題を読み込み（新規追加前のデータが必要）
    # まず現在のquestions.jsonから新規追加分を除いた元データを推定
    current_questions = load_json_file("public/data/questions.json")
    new_3kyuu = load_json_file("additional_3kyuu_questions.json")
    new_2kyuu = load_json_file("additional_2kyuu_questions.json")
    
    print("=== 重複チェック開始 ===")
    print(f"現在の総問題数: {len(current_questions)}")
    print(f"新規3級問題: {len(new_3kyuu)}")
    print(f"新規2級問題: {len(new_2kyuu)}")
    
    # 既存問題を推定（新規追加分を除く）
    # IDの範囲から推定
    max_existing_id = 487  # 作業前の問題数
    existing_questions = [q for q in current_questions 
                         if q['id'].startswith('q') and 
                         int(q['id'][1:]) <= max_existing_id]
    
    print(f"既存問題数（推定）: {len(existing_questions)}")
    
    # 新規追加問題をまとめる
    all_new_questions = new_3kyuu + new_2kyuu
    
    duplicates_found = []
    high_similarity_pairs = []
    
    print("\n=== 新規問題 vs 既存問題の重複チェック ===")
    
    for new_q in all_new_questions:
        print(f"\n📝 新規問題: {new_q['id']} ({new_q['level']}, {new_q['category']})")
        print(f"   問題: {new_q['question'][:60]}...")
        
        best_match = None
        best_similarity = 0.0
        
        for existing_q in existing_questions:
            # 同じ級とカテゴリの問題のみチェック
            if (new_q['level'] == existing_q['level'] and 
                new_q['category'] == existing_q['category']):
                
                similarity, reason = calculate_similarity(new_q, existing_q)
                
                if similarity > 0.4:  # 閾値: 40%以上で要注意
                    if similarity > best_similarity:
                        best_similarity = similarity
                        best_match = existing_q
        
        if best_match:
            if best_similarity > 0.7:  # 70%以上で重複とみなす
                duplicates_found.append({
                    'new_question': new_q,
                    'existing_question': best_match,
                    'similarity': best_similarity,
                    'reason': reason
                })
                print(f"   ⚠️ 重複疑い: {best_similarity:.2f} - {best_match['question'][:40]}...")
            elif best_similarity > 0.4:  # 40%以上で類似として報告
                high_similarity_pairs.append({
                    'new_question': new_q,
                    'existing_question': best_match,
                    'similarity': best_similarity,
                    'reason': reason
                })
                print(f"   ⚡ 類似注意: {best_similarity:.2f} - {best_match['question'][:40]}...")
            else:
                print(f"   ✅ 問題なし: {best_similarity:.2f}")
        else:
            print(f"   ✅ 同カテゴリ内で重複なし")
    
    print("\n=== 新規問題間の重複チェック ===")
    
    new_vs_new_duplicates = []
    
    for i, q1 in enumerate(all_new_questions):
        for j, q2 in enumerate(all_new_questions[i+1:], i+1):
            if (q1['level'] == q2['level'] and 
                q1['category'] == q2['category']):
                
                similarity, reason = calculate_similarity(q1, q2)
                
                if similarity > 0.6:  # 新規問題間は60%で要注意
                    new_vs_new_duplicates.append({
                        'question1': q1,
                        'question2': q2,
                        'similarity': similarity,
                        'reason': reason
                    })
    
    # 結果報告
    print("\n" + "="*60)
    print("📊 重複チェック結果")
    print("="*60)
    
    if duplicates_found:
        print(f"\n🚨 重複問題発見: {len(duplicates_found)}件")
        for dup in duplicates_found:
            print(f"\n重複度: {dup['similarity']:.2f}")
            print(f"新規: {dup['new_question']['question']}")
            print(f"既存: {dup['existing_question']['question']}")
            print(f"理由: {dup['reason']}")
    else:
        print(f"\n✅ 重複問題: 0件")
    
    if high_similarity_pairs:
        print(f"\n⚠️ 類似問題（要確認）: {len(high_similarity_pairs)}件")
        for pair in high_similarity_pairs:
            print(f"\n類似度: {pair['similarity']:.2f}")
            print(f"新規: {pair['new_question']['question']}")
            print(f"既存: {pair['existing_question']['question']}")
            print(f"理由: {pair['reason']}")
    else:
        print(f"\n✅ 類似問題（要確認）: 0件")
    
    if new_vs_new_duplicates:
        print(f"\n🔄 新規問題間重複: {len(new_vs_new_duplicates)}件")
        for dup in new_vs_new_duplicates:
            print(f"\n類似度: {dup['similarity']:.2f}")
            print(f"問題1: {dup['question1']['question']}")
            print(f"問題2: {dup['question2']['question']}")
    else:
        print(f"\n✅ 新規問題間重複: 0件")
    
    # カテゴリ別新規問題統計
    print(f"\n📈 カテゴリ別新規問題統計")
    category_stats = {}
    for q in all_new_questions:
        key = f"{q['level']}_{q['category']}"
        category_stats[key] = category_stats.get(key, 0) + 1
    
    for key, count in sorted(category_stats.items()):
        level, category = key.split('_', 1)
        print(f"  {level} {category}: {count}問")
    
    return duplicates_found, high_similarity_pairs, new_vs_new_duplicates

if __name__ == "__main__":
    check_duplicates_comprehensive()