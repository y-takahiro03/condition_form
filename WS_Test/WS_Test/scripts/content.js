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

// --- 3. (オプション) カテゴリの自動検知 ---
// ページ読み込み時にカテゴリを特定し、サイドパネルに伝えるための準備
// ここに「カテゴリが書いてある要素」を特定する処理を後で追加します。
