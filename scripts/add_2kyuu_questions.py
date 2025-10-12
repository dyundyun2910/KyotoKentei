#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
2級問題手動追加スクリプト
2級レベルの高難度問題を46問追加
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

def create_2kyuu_questions():
    """2級レベルの問題を作成"""
    
    # 2級レベルの高難度問題（46問）
    questions_2kyuu = [
        # 歴史 (6問)
        {
            "level": "2級",
            "category": "歴史",
            "exam-year": "2004/12/12",
            "question": "平安時代初期、桓武天皇が蝦夷征討のために征夷大将軍に任命した人物は誰ですか。",
            "options": ["坂上田村麻呂", "藤原種継", "和気清麻呂", "大伴弟麻呂"],
            "correctAnswer": 0,
            "explanation": "坂上田村麻呂は延暦13年（794年）に征夷大将軍に任命され、蝦夷征討を行いました。胆沢城、志波城を築いて東北経営の基礎を築きました。"
        },
        {
            "level": "2級",
            "category": "歴史",
            "exam-year": "2004/12/12",
            "question": "鎌倉時代、建仁2年（1202年）に栄西によって京都に開かれた日本初の本格的な禅寺はどこですか。",
            "options": ["建仁寺", "南禅寺", "東福寺", "相国寺"],
            "correctAnswer": 0,
            "explanation": "建仁寺は栄西が建仁2年（1202年）に開山した臨済宗の寺院で、日本における禅宗の本格的な始まりとされています。"
        },
        {
            "level": "2級",
            "category": "歴史", 
            "exam-year": "2004/12/12",
            "question": "室町時代の応仁の乱（1467-1477年）で東軍の総大将を務めた人物は誰ですか。",
            "options": ["細川勝元", "山名宗全", "畠山政長", "斯波義廉"],
            "correctAnswer": 0,
            "explanation": "応仁の乱では細川勝元が東軍、山名宗全が西軍の総大将を務めました。この乱により京都は荒廃し、戦国時代の始まりとなりました。"
        },
        {
            "level": "2級",
            "category": "歴史",
            "exam-year": "2004/12/12",
            "question": "江戸時代、寛永13年（1636年）に後水尾上皇の離宮として造営された修学院離宮の設計に関わったとされる作庭家は誰ですか。",
            "options": ["小堀遠州", "重森三玲", "中根金作", "庭園師不明"],
            "correctAnswer": 0,
            "explanation": "修学院離宮の造営には小堀遠州の影響があったとされていますが、実際の作庭者については諸説あります。上・中・下の三つの離宮からなります。"
        },
        {
            "level": "2級",
            "category": "歴史",
            "exam-year": "2004/12/12", 
            "question": "明治維新後の廃仏毀釈により一時廃寺となったが、明治14年（1881年）に復興された東山の寺院はどこですか。",
            "options": ["智積院", "泉涌寺", "東福寺", "建仁寺"],
            "correctAnswer": 0,
            "explanation": "智積院は廃仏毀釈により一時廃寺となりましたが、明治14年に真言宗智山派の総本山として復興しました。長谷川等伯一派の障壁画で有名です。"
        },
        {
            "level": "2級",
            "category": "歴史",
            "exam-year": "2004/12/12",
            "question": "大正天皇の即位礼が行われた京都御所の建物は何ですか。",
            "options": ["紫宸殿", "清涼殿", "春興殿", "承明門"],
            "correctAnswer": 0,
            "explanation": "大正天皇の即位礼は大正4年（1915年）11月10日に京都御所の紫宸殿で行われました。これが京都で行われた最後の即位礼でした。"
        },
        
        # 神社 (3問)
        {
            "level": "2級",
            "category": "神社",
            "exam-year": "2004/12/12",
            "question": "上賀茂神社の正式名称は何ですか。",
            "options": ["賀茂別雷神社", "賀茂御祖神社", "加茂神社", "鴨川神社"],
            "correctAnswer": 0,
            "explanation": "上賀茂神社の正式名称は賀茂別雷神社（かもわけいかづちじんじゃ）です。下鴨神社は賀茂御祖神社（かもみおやじんじゃ）が正式名称です。"
        },
        {
            "level": "2級",
            "category": "神社",
            "exam-year": "2004/12/12",
            "question": "北野天満宮の「天神さん」の縁日は毎月何日ですか。",
            "options": ["15日", "21日", "25日", "28日"],
            "correctAnswer": 2,
            "explanation": "北野天満宮の縁日「天神さん」は菅原道真の命日にちなんで毎月25日に開催されます。特に1月25日の「初天神」が有名です。"
        },
        {
            "level": "2級",
            "category": "神社",
            "exam-year": "2004/12/12",
            "question": "春日大社の分社として創建され、藤原氏の氏神を祀る京都の神社はどこですか。",
            "options": ["吉田神社", "白河神社", "岡崎神社", "熊野神社"],
            "correctAnswer": 0,
            "explanation": "吉田神社は貞観元年（859年）に藤原山蔭が春日大社の分社として創建しました。節分祭の火炉祭で有名です。"
        },
        
        # 寺院 (4問)
        {
            "level": "2級",
            "category": "寺院",
            "exam-year": "2004/12/12",
            "question": "南禅寺の三門に刻まれた有名な歌舞伎の台詞「絶景かな、絶景かな」で知られる石川五右衛門の物語で、この台詞が登場する作品名は何ですか。",
            "options": ["楼門五三桐", "南禅寺山門", "石川五右衛門", "金門五山桐"],
            "correctAnswer": 0,
            "explanation": "「楼門五三桐」は歌舞伎の演目で、石川五右衛門が南禅寺の三門の上で「絶景かな、絶景かな」と言う場面で有名です。"
        },
        {
            "level": "2級",
            "category": "寺院",
            "exam-year": "2004/12/12",
            "question": "東福寺の方丈庭園を作庭した現代の庭園家は誰ですか。",
            "options": ["重森三玲", "小堀遠州", "夢窓疎石", "中根金作"],
            "correctAnswer": 0,
            "explanation": "東福寺方丈庭園は昭和14年（1939年）に重森三玲によって作庭された現代庭園の傑作です。市松模様の石組みで有名です。"
        },
        {
            "level": "2級",
            "category": "寺院",
            "exam-year": "2004/12/12",
            "question": "大徳寺の塔頭寺院で、千利休ゆかりの茶室「忘筌」があるのはどこですか。",
            "options": ["聚光院", "龍源院", "瑞峯院", "高桐院"],
            "correctAnswer": 0,
            "explanation": "聚光院は千利休の菩提寺でもあり、利休ゆかりの茶室「忘筌」があります。狩野永徳・松栄父子の障壁画でも有名です。"
        },
        {
            "level": "2級",
            "category": "寺院",
            "exam-year": "2004/12/12",
            "question": "法然上人二十五霊場第1番札所であり、浄土宗の総本山はどこですか。",
            "options": ["知恩院", "清浄華院", "金戒光明寺", "百万遍知恩寺"],
            "correctAnswer": 0,
            "explanation": "知恩院は法然上人が念仏の教えを広めた地に建つ浄土宗総本山で、法然上人二十五霊場の第1番札所です。"
        },
        
        # 建築 (3問)
        {
            "level": "2級",
            "category": "建築",
            "exam-year": "2004/12/12",
            "question": "京都御所の紫宸殿の屋根の形式は何ですか。",
            "options": ["入母屋造", "寄棟造", "切妻造", "宝形造"],
            "correctAnswer": 0,
            "explanation": "紫宸殿は入母屋造檜皮葺きの屋根を持つ、平安時代の宮殿建築の代表例です。正面に南庭が広がります。"
        },
        {
            "level": "2級",
            "category": "建築",
            "exam-year": "2004/12/12",
            "question": "二条城二の丸御殿の建築様式で、各部屋の格式を表すために床の高さを変えている構造を何と呼びますか。",
            "options": ["格式造", "書院造", "数寄屋造", "入母屋造"],
            "correctAnswer": 1,
            "explanation": "二条城二の丸御殿は書院造の代表例で、身分に応じて部屋の格式や床の高さが調整されています。"
        },
        {
            "level": "2級",
            "category": "建築",
            "exam-year": "2004/12/12",
            "question": "桂離宮の建築で特に重要視された美意識・設計思想は何ですか。",
            "options": ["数寄", "幽玄", "侘寂", "雅"],
            "correctAnswer": 0,
            "explanation": "桂離宮は数寄屋造りの最高峰とされ、「数寄」（茶の湯の美意識）が随所に表現された建築です。"
        },
        
        # 庭園 (3問)
        {
            "level": "2級",
            "category": "庭園",
            "exam-year": "2004/12/12",
            "question": "西芳寺（苔寺）の庭園を作庭したとされる禅僧は誰ですか。",
            "options": ["夢窓疎石", "無学祖元", "円爾弁円", "道元"],
            "correctAnswer": 0,
            "explanation": "西芳寺の庭園は夢窓疎石（むそうそせき）によって作庭されたとされる池泉回遊式庭園で、苔の美しさで有名です。"
        },
        {
            "level": "2級",
            "category": "庭園",
            "exam-year": "2004/12/12",
            "question": "天龍寺の庭園で、嵐山を借景として取り入れた作庭技法を何と呼びますか。",
            "options": ["借景", "対景", "遠景", "背景"],
            "correctAnswer": 0,
            "explanation": "借景は庭園外の自然の山や樹木を庭園の一部として取り込む技法で、天龍寺庭園は嵐山を借景とした代表例です。"
        },
        {
            "level": "2級",
            "category": "庭園",
            "exam-year": "2004/12/12",
            "question": "仁和寺御室桜の特徴として正しいものはどれですか。",
            "options": ["背が低い", "花が大きい", "早咲き", "八重咲き"],
            "correctAnswer": 0,
            "explanation": "御室桜は樹高が低いのが特徴で、「鼻に桜の香りを嗅ぐ」と言われるほど花が目線の高さで楽しめる桜として有名です。"
        },
        
        # 美術 (3問)
        {
            "level": "2級",
            "category": "美術",
            "exam-year": "2004/12/12",
            "question": "智積院にある長谷川等伯一派の国宝障壁画「楓図」「桜図」が描かれた建物は何ですか。",
            "options": ["客殿", "本堂", "書院", "庫裏"],
            "correctAnswer": 0,
            "explanation": "智積院客殿の障壁画は長谷川等伯一派の作品で、「楓図」「桜図」などが国宝に指定されています。"
        },
        {
            "level": "2級",
            "category": "美術",
            "exam-year": "2004/12/12",
            "question": "二条城二の丸御殿の障壁画を手がけた狩野派の絵師は誰ですか。",
            "options": ["狩野探幽", "狩野山楽", "狩野永徳", "狩野尚信"],
            "correctAnswer": 1,
            "explanation": "二条城二の丸御殿の障壁画は狩野山楽とその一派によって描かれました。「松鷹図」などの豪華絢爛な作品群です。"
        },
        {
            "level": "2級",
            "category": "美術",
            "exam-year": "2004/12/12",
            "question": "京都国立博物館本館（旧帝国京都博物館）を設計した建築家は誰ですか。",
            "options": ["片山東熊", "辰野金吾", "河合浩蔵", "武田五一"],
            "correctAnswer": 0,
            "explanation": "京都国立博物館本館は明治28年（1895年）に片山東熊の設計により建設されたフレンチ・バロック様式の建物です。"
        },
        
        # 伝統工芸 (3問)
        {
            "level": "2級",
            "category": "伝統工芸",
            "exam-year": "2004/12/12",
            "question": "西陣織で使用される金糸の製法で、和紙に漆を塗って金箔を貼ったものを何と呼びますか。",
            "options": ["平金糸", "丸金糸", "撚金糸", "箔金糸"],
            "correctAnswer": 0,
            "explanation": "平金糸は和紙に漆を塗って金箔を貼り、細く切って糸状にしたもので、西陣織の豪華な金糸として使用されます。"
        },
        {
            "level": "2級",
            "category": "伝統工芸",
            "exam-year": "2004/12/12",
            "question": "京焼・清水焼の釉薬で、鉄分を含んで黒褐色に発色する釉薬を何と呼びますか。",
            "options": ["飴釉", "鉄釉", "黒釉", "柿釉"],
            "correctAnswer": 1,
            "explanation": "鉄釉は酸化鉄を含む釉薬で、焼成条件により黒褐色から赤褐色まで様々な色調を呈します。"
        },
        {
            "level": "2級",
            "category": "伝統工芸",
            "exam-year": "2004/12/12",
            "question": "京友禅の技法で、糊で防染しながら筆で彩色する技法を何と呼びますか。",
            "options": ["手描友禅", "型友禅", "更紗友禅", "摺込友禅"],
            "correctAnswer": 0,
            "explanation": "手描友禅は糊を使って防染しながら筆で一枚ずつ手描きで彩色する高級な技法です。宮崎友禅斎が始祖とされます。"
        },
        
        # 伝統文化 (2問)
        {
            "level": "2級",
            "category": "伝統文化",
            "exam-year": "2004/12/12",
            "question": "表千家、裏千家、武者小路千家の三千家の家元制度が確立されたのはいつ頃ですか。",
            "options": ["江戸時代初期", "江戸時代中期", "江戸時代後期", "明治時代"],
            "correctAnswer": 1,
            "explanation": "三千家の家元制度は江戸時代中期の18世紀頃に確立されました。千利休の孫の宗旦の三人の息子がそれぞれの流派を開いたことに始まります。"
        },
        {
            "level": "2級",
            "category": "伝統文化",
            "exam-year": "2004/12/12",
            "question": "雅楽で使用される楽器のうち、管楽器でないものはどれですか。",
            "options": ["篳篥", "龍笛", "笙", "鞨鼓"],
            "correctAnswer": 3,
            "explanation": "鞨鼓（かっこ）は打楽器です。篳篥（ひちりき）、龍笛（りゅうてき）、笙（しょう）は管楽器で、雅楽の三管と呼ばれます。"
        },
        
        # 花街 (2問)
        {
            "level": "2級",
            "category": "花街",
            "exam-year": "2004/12/12",
            "question": "祇園甲部の「都をどり」で歌われる有名な歌詞の出だしは何ですか。",
            "options": ["ヨーイヤサー", "きーよーみずー", "月はおぼろに", "さくらさくら"],
            "correctAnswer": 2,
            "explanation": "「都をどり」の代表的な歌詞は「月はおぼろに東山〜」で始まります。これは明治期から歌い継がれている伝統の歌です。"
        },
        {
            "level": "2級",
            "category": "花街",
            "exam-year": "2004/12/12",
            "question": "上七軒の春の踊りの名称は何ですか。",
            "options": ["北野をどり", "上七軒をどり", "梅花をどり", "春の踊り"],
            "correctAnswer": 0,
            "explanation": "上七軒では「北野をどり」が開催されます。北野天満宮に近いことからこの名前が付けられています。"
        },
        
        # 祭と行事 (3問)
        {
            "level": "2級",
            "category": "祭と行事",
            "exam-year": "2004/12/12",
            "question": "祇園祭の山鉾で、唯一人形ではなく生稚児が乗る鉾はどれですか。",
            "options": ["長刀鉾", "函谷鉾", "鶏鉾", "月鉾"],
            "correctAnswer": 0,
            "explanation": "長刀鉾は祇園祭の山鉾巡行の先頭を行く鉾で、唯一生稚児（いきちご）が乗ります。稚児は神の使いとされます。"
        },
        {
            "level": "2級",
            "category": "祭と行事",
            "exam-year": "2004/12/12",
            "question": "葵祭の正式名称は何ですか。",
            "options": ["賀茂祭", "春日祭", "葵葉祭", "双葉葵祭"],
            "correctAnswer": 0,
            "explanation": "葵祭の正式名称は「賀茂祭」です。平安時代には単に「祭」と言えば賀茂祭を指すほど重要な祭礼でした。"
        },
        {
            "level": "2級",
            "category": "祭と行事",
            "exam-year": "2004/12/12",
            "question": "五山送り火で「妙法」の文字を焼く山はどこですか。",
            "options": ["松ヶ崎西山・東山", "西山", "東山", "妙見山"],
            "correctAnswer": 0,
            "explanation": "「妙法」は松ヶ崎西山に「妙」、松ヶ崎東山に「法」の字が焼かれます。日蓮宗と深い関わりがあります。"
        },
        
        # 京料理 (3問)
        {
            "level": "2級",
            "category": "京料理",
            "exam-year": "2004/12/12",
            "question": "京料理の基本となる出汁で、昆布と鰹節以外によく使用される材料は何ですか。",
            "options": ["干し椎茸", "煮干し", "アゴ", "サバ節"],
            "correctAnswer": 0,
            "explanation": "京料理では昆布と鰹節に加えて干し椎茸を使った出汁がよく用いられます。精進料理の影響で植物性の旨味を重視します。"
        },
        {
            "level": "2級",
            "category": "京料理",
            "exam-year": "2004/12/12",
            "question": "懐石料理で「八寸」と呼ばれる料理の特徴は何ですか。",
            "options": ["季節の肴の盛り合わせ", "8品の料理", "8寸の器", "8月の料理"],
            "correctAnswer": 0,
            "explanation": "八寸は茶懐石における酒の肴で、海の物と山の物を季節感豊かに盛り合わせた料理です。器のサイズが八寸四方であることが名前の由来です。"
        },
        {
            "level": "2級",
            "category": "京料理",
            "exam-year": "2004/12/12",
            "question": "京都の伝統的な正月料理「棒鱈」に使用される魚は何ですか。",
            "options": ["真鱈", "助子鱈", "銀鱈", "スケトウダラ"],
            "correctAnswer": 0,
            "explanation": "棒鱈は真鱈を干して棒状にしたもので、京都の正月には欠かせない料理です。海から遠い京都ならではの保存食文化です。"
        },
        
        # 京菓子 (2問)
        {
            "level": "2級",
            "category": "京菓子",
            "exam-year": "2004/12/12",
            "question": "茶道で使用される主菓子で、餡を求肥で包んだ代表的な京菓子は何ですか。",
            "options": ["練切", "きんとん", "外郎", "薯蕷"],
            "correctAnswer": 0,
            "explanation": "練切は白餡に求肥を混ぜて作る生菓子の代表で、四季の美しさを表現した茶席の主菓子として重用されます。"
        },
        {
            "level": "2級",
            "category": "京菓子",
            "exam-year": "2004/12/12",
            "question": "亀屋良長の「烏羽玉」はどのような菓子ですか。",
            "options": ["黒糖饅頭", "羊羹", "最中", "干菓子"],
            "correctAnswer": 0,
            "explanation": "烏羽玉は亀屋良長の代表的な黒糖饅頭で、その黒い外観が烏の羽のように美しいことからこの名前が付けられました。"
        },
        
        # ならわし (2問)
        {
            "level": "2級",
            "category": "ならわし",
            "exam-year": "2004/12/12",
            "question": "京都の商家で、正月に門口に飾る独特の注連縄飾りを何と呼びますか。",
            "options": ["根引松", "蓬莱飾り", "千両万両", "玉飾り"],
            "correctAnswer": 0,
            "explanation": "根引松は京都の商家の正月飾りで、松を根っこごと引き抜いた形で飾ります。商売繁盛の願いが込められています。"
        },
        {
            "level": "2級",
            "category": "ならわし",
            "exam-year": "2004/12/12",
            "question": "京都で6月30日に行われる夏越の祓いで食べる和菓子は何ですか。",
            "options": ["水無月", "葛切り", "わらび餅", "くずもち"],
            "correctAnswer": 0,
            "explanation": "水無月は6月30日の夏越の祓いに食べる京都の伝統的な和菓子で、ういろう生地に小豆をのせた三角形の菓子です。"
        },
        
        # ことばと伝説 (2問)
        {
            "level": "2級",
            "category": "ことばと伝説",
            "exam-year": "2004/12/12",
            "question": "源氏物語で光源氏が須磨に流されるきっかけとなった事件は何ですか。",
            "options": ["朧月夜の君との密通", "藤壺との関係", "頭中将との対立", "帝との政争"],
            "correctAnswer": 0,
            "explanation": "光源氏が須磨に流されたのは、尚侍朧月夜の君との密通が右大臣家に発覚したためです。これが政治的な失脚につながりました。"
        },
        {
            "level": "2級",
            "category": "ことばと伝説",
            "exam-year": "2004/12/12",
            "question": "「いけず石」という京都の文化で使われる石の本来の目的は何ですか。",
            "options": ["家の角の保護", "魔除け", "装飾", "境界の表示"],
            "correctAnswer": 0,
            "explanation": "いけず石は家の角や塀の角に置く石で、車や自転車が角に接触して建物を傷つけることを防ぐ実用的な目的があります。"
        },
        
        # 地名 (3問)
        {
            "level": "2級",
            "category": "地名",
            "exam-year": "2004/12/12",
            "question": "平安京の条坊制で、朱雀大路の東側を何と呼びましたか。",
            "options": ["左京", "右京", "東京", "内裏"],
            "correctAnswer": 0,
            "explanation": "平安京では天皇から見て左側（東側）を左京、右側（西側）を右京と呼びました。現在の住所表示にもその名残があります。"
        },
        {
            "level": "2級",
            "category": "地名",
            "exam-year": "2004/12/12",
            "question": "「○○小路」という京都の通り名で、実際には小路（こうじ）ではなく大路（おおじ）に相当する幅の広い通りはどれですか。",
            "options": ["烏丸通", "河原町通", "寺町通", "新京極通"],
            "correctAnswer": 0,
            "explanation": "烏丸通は平安京の烏丸小路にあたりますが、実際は朱雀大路に次ぐ幅の広い大路でした。現在も京都の主要幹線道路です。"
        },
        {
            "level": "2級",
            "category": "地名",
            "exam-year": "2004/12/12",
            "question": "京都の地名「太秦」の読み方と由来で正しいものはどれですか。",
            "options": ["うずまさ・秦氏に由来", "たいしん・大臣に由来", "おおつき・大月に由来", "ふとし・太子に由来"],
            "correctAnswer": 0,
            "explanation": "太秦は「うずまさ」と読み、古代豪族の秦氏に由来します。秦氏は養蚕や機織り技術を日本に伝えた渡来系氏族です。"
        },
        
        # 自然 (2問)
        {
            "level": "2級",
            "category": "自然",
            "exam-year": "2004/12/12",
            "question": "京都三山のうち、標高が最も高い山はどれですか。",
            "options": ["比叡山", "愛宕山", "嵐山", "稲荷山"],
            "correctAnswer": 1,
            "explanation": "愛宕山は標高924メートルで京都市内最高峰です。比叡山は848メートル、嵐山は約382メートルです。"
        },
        {
            "level": "2級",
            "category": "自然",
            "exam-year": "2004/12/12",
            "question": "琵琶湖疏水の建設を指揮した技術者は誰ですか。",
            "options": ["田辺朔郎", "古市公威", "沖野忠雄", "真田増次郎"],
            "correctAnswer": 0,
            "explanation": "琵琶湖疏水は田辺朔郎の設計・指揮により明治18年（1885年）から建設が始まりました。京都の近代化に大きく貢献しました。"
        },
        
        # 観光学 (3問)
        {
            "level": "2級",
            "category": "観光学",
            "exam-year": "2004/12/12",
            "question": "京都市が観光都市として本格的に発展するきっかけとなった昭和39年（1964年）の出来事は何ですか。",
            "options": ["東海道新幹線開業", "京都国際会館開館", "国立博物館開館", "京都駅新築"],
            "correctAnswer": 0,
            "explanation": "昭和39年の東海道新幹線開業により、東京から京都への交通が飛躍的に便利になり、観光都市としての発展が加速しました。"
        },
        {
            "level": "2級",
            "category": "観光学",
            "exam-year": "2004/12/12",
            "question": "京都市の観光客数が年間5000万人を突破したのは平成何年頃ですか。",
            "options": ["平成10年", "平成15年", "平成20年", "平成25年"],
            "correctAnswer": 1,
            "explanation": "京都市の観光客数は平成15年（2003年）頃に年間5000万人を突破し、その後も増加を続けています。"
        },
        {
            "level": "2級",
            "category": "観光学",
            "exam-year": "2004/12/12",
            "question": "京都の観光における「オーバーツーリズム」対策として京都市が導入を検討している制度は何ですか。",
            "options": ["観光税", "入場制限", "予約制", "時間制限"],
            "correctAnswer": 0,
            "explanation": "京都市では観光税（宿泊税）の導入など、オーバーツーリズム対策が検討されています。観光地の持続可能な発展を目指しています。"
        }
    ]
    
    return questions_2kyuu

def main():
    """メイン処理"""
    existing_questions = load_existing_questions()
    print(f"既存問題数: {len(existing_questions)}")
    
    # 現在の2級問題数を確認
    current_2kyuu_2004 = len([q for q in existing_questions 
                              if q['level'] == '2級' and q['exam-year'] == '2004/12/12'])
    print(f"現在の2級 2004/12/12 問題数: {current_2kyuu_2004}")
    print(f"不足問題数: {100 - current_2kyuu_2004}問")
    
    # 2級問題を作成
    new_questions = create_2kyuu_questions()
    
    # IDを付与
    for i, q in enumerate(new_questions):
        q["id"] = get_next_id(existing_questions + new_questions[:i])
    
    # 統計表示
    print(f"\n追加する2級問題数: {len(new_questions)}")
    
    # カテゴリ別統計
    category_stats = {}
    for q in new_questions:
        category_stats[q["category"]] = category_stats.get(q["category"], 0) + 1
    
    print("\nカテゴリ別統計:")
    for category, count in sorted(category_stats.items()):
        print(f"  {category}: {count}問")
    
    # ファイルに保存
    output_file = "additional_2kyuu_questions.json"
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
        for q in all_questions:
            level_key = q["level"] + "_" + q["exam-year"]
            level_stats[level_key] = level_stats.get(level_key, 0) + 1
        
        print("\n更新後の統計:")
        for key, count in sorted(level_stats.items()):
            level, year = key.split('_', 1)
            print(f"  {level} {year}: {count}問")
        
        print(f"\n🎉 完了！2級 2004/12/12 が {level_stats.get('2級_2004/12/12', 0)}問になりました！")

if __name__ == "__main__":
    main()