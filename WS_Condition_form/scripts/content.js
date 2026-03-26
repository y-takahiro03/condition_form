// --- カテゴリ判定用の辞書 ---
const categoryKeywords = {
  ジャケット: [
    "半袖Ｔシャツ",
    "長袖Ｔシャツ",
    "半袖シャツ",
    "長袖シャツ",
    "ポロシャツ",
    "ランニング",
    "タンクトップ",
    "キャミソール",
    "チューブトップ",
    "ブラウス",
    "カットソー",
    "ニット",
    "セーター",
    "カーディガン",
    "アンサンブル",
    "チュニック",
    "スウェット",
    "パーカー",
    "ベスト",
    "ワンピース",
    "ジャージ",
    "その他トップス",
    "ジャケット",
    "レザージャケット",
    "テーラードジャケット",
    "ノーカラージャケット",
    "デニムジャケット",
    "カバーオール",
    "マウンテンパーカー",
    "ナイロンジャケット",
    "ライダースジャケット",
    "ミリタリージャケット",
    "スイングトップ",
    "ブルゾン",
    "スタジャン",
    "スカジャン",
    "ダウンジャケット",
    "ダウンベスト",
    "コート",
    "ダッフルコート",
    "ステンカラーコート",
    "トレンチコート",
    "ピーコート",
    "モッズコート",
    "ミリタリーコート",
    "ポンチョ",
    "その他アウター",
  ],
  パンツ: [
    "パンツ",
    "デニムパンツ",
    "チノパンツ",
    "カーゴパンツ",
    "クロップドパンツ",
    "ショートパンツ",
    "サルエルパンツ",
    "スキニーパンツ",
    "スカート",
    "ミニスカート",
    "ロングスカート",
    "ジャンパースカート",
    "ジャンパースカート",
    "スカートパンツ",
    "その他ボトムス",
  ],
  セット: [
    "スーツ",
    "スーツ3点セット",
    "セットアップ",
    "セットアップ (スカート)",
    "セットアップ (ワンピース)",
    "ドレス",
    "オーバーオール",
    "サロペット",
    "ツナギ",
    "その他セット",
  ],
  くつ: [
    "スニーカー",
    "スリッポン",
    "サンダル",
    "パンプス",
    "ブーツ",
    "ブーティ",
    "ドレスシューズ",
    "バレエシューズ",
    "ローファー",
    "デッキシューズ",
    "モカシン",
    "ミュール",
    "レインシューズ",
    "ビーチサンダル",
    "シューズ",
    "その他靴",
  ],
  帽子: [
    "キャップ",
    "ハット",
    "ニットキャップ",
    "ハンチング",
    "ベレー帽",
    "キャスケット",
    "サンバイザー",
    "その他帽子",
  ],
  バッグ: [
    "ショルダーバッグ",
    "ハンドバッグ",
    "ボストンバッグ",
    "トートバッグ",
    "ウエストバッグ",
    "リュック・デイパック",
    "リュックサック",
    "メッセンジャーバッグ",
    "ボディバッグ",
    "セカンドバッグ",
    "クラッチバッグ",
    "ビジネスバッグ",
    "ブリーフケース",
    "キャリーバッグ",
    "スーツケース",
    "トランク",
    "エコバック",
    "その他バッグ",
  ],
  財布・小物: [
    "長財布",
    "二つ折り財布",
    "三つ折り財布",
    "コンパクトウォレット",
    "コインケース",
    "札入れ",
    "名刺入れ",
    "カードケース",
    "パスケース",
    "パスポートケース",
    "キーケース",
    "キーホルダー",
    "ウォレットチェーン",
    "ポーチ",
    "ストラップ",
    "ショルダーストラップ",
    "スカーフ",
    "ハンカチ",
    "タオル",
    "手鏡・コンパクト",
    "その他小物",
  ],
  ファッション雑貨: [
    "ネクタイ",
    "ストール",
    "スヌード",
    "マフラー",
    "ショール",
    "ベルト",
    "サスペンダー",
    "サングラス",
    "メガネ",
    "手袋",
    "ネックウォーマー",
    "イヤーマフ",
    "その他ファッション雑貨",
  ],
  時計・ライター: ["腕時計", "置時計", "掛時計", "懐中時計", "ライター", ""],
  アクセサリー: [
    "リング・指輪",
    "イヤリング",
    "ピアス",
    "ネックレス",
    "ペンダントトップ",
    "ブレスレット",
    "ブローチ",
    "マネークリップ",
    "チャーム",
    "タイピン",
    "チョーカー",
    "バレッタ",
    "ペンダント",
    "バングル",
    "スカーフリング",
    "カフス",
    "その他アクセサリー",
  ],
};

// --- 文字列からカテゴリを判定する関数 ---
function detectCategory(inputText) {
  if (!inputText) return "不明";

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => inputText.includes(keyword))) {
      return category;
    }
  }
  return "不明";
}

// --- 画面ロード時の処理 ---
window.addEventListener("load", () => {
  // .custom-combobox-input クラスを持つすべての要素を配列として取得
  const comboboxes = document.querySelectorAll(".custom-combobox-input");

  // 要素が確実に2つ以上存在するかチェック（エラー防止）
  if (comboboxes.length >= 2) {
    const targetInput = comboboxes[1]; // 2番目の要素を指定
    const inputText = targetInput.value; // input要素に入力されている文字を取得

    const detectedCategory = detectCategory(inputText);

    // カテゴリが判明した場合のみ、サイドパネルへメッセージを送信
    if (detectedCategory !== "不明") {
      chrome.runtime.sendMessage({
        type: "CATEGORY_DETECTED",
        category: detectedCategory,
      });
    }
  }
});

// --- 1. サイドパネルからのメッセージを受信 ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FILL_FORM") {
    const success = fillConditionForm(message.text);
    sendResponse({ success: success });
  }
  return true; // 非同期レスポンスのために必要
});

// --- 2. フォームに値を入力する関数 ---
function fillConditionForm(text) {
  // 指定されたIDのtextareaを探す
  const targetTextArea = document.getElementById("product_detail214");

  if (targetTextArea) {
    // 既存の文字がある場合は改行して追加、なければそのまま入力
    const currentValue = targetTextArea.value;
    if (currentValue) {
      targetTextArea.value = currentValue + "\n" + text;
    } else {
      targetTextArea.value = text;
    }

    // --- 重要：入力イベントを強制的に発生させる ---
    // これをしないと、ブラウザが「文字が入った」と認識せず、保存時に空になることがあります。
    const event = new Event("input", { bubbles: true });
    targetTextArea.dispatchEvent(event);

    // 視認性のためにフォーカスを当てる
    targetTextArea.focus();

    return true;
  } else {
    console.error("入力先のtextareaが見つかりませんでした: #product_detail214");
    return false;
  }
}
