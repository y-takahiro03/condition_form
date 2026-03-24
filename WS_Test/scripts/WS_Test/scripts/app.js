// ==========================================
// --- 状態管理（アプリの記憶領域） ---
// ==========================================
// ユーザーが現在何を選んでいるかを覚えておくための箱（オブジェクト）です。
let state = {
  category: "ジャケット",
  // Set（セット）は「重複を許さないリスト」です。同じ部位を2回入れても1つにまとまるため、複数選択にとても便利です。
  selectedParts: new Set(),
  damages: new Set(),
  severity: "", // 程度は「1つだけ」選ぶルールなので、単なる文字列（""）にしています。
};

// ==========================================
// --- DOM要素の取得（HTMLの部品を集めてくる） ---
// ==========================================
// HTMLタグに付けた id や class を手がかりに、JavaScriptで操作したい部品をここで一気に取得します。
const selectedPartNameEl = document.getElementById("selected-part-name");
const resultTextArea = document.getElementById("result-text");
const damageChips = document.querySelectorAll("#damage-chips .chip");
const severityChips = document.querySelectorAll("#severity-chips .chip-single");
const copyBtn = document.getElementById("copy-btn");
const clearBtn = document.getElementById("clear-btn");

// .selectable-part というクラスが付いたもの（SVGの図形と、部位チップの両方）を全部取得します。
const selectableParts = document.querySelectorAll(".selectable-part");

// ==========================================
// --- モード＆前後切り替え処理 ---
// ==========================================
const btnModeSvg = document.getElementById("btn-mode-svg");
const btnModeChip = document.getElementById("btn-mode-chip");
const visualPicker = document.getElementById("visual-picker");

// ★ 画像 / ボタン 切り替え
btnModeSvg.addEventListener("click", () => {
  btnModeSvg.classList.add("active"); // 押されたボタンを青くする
  btnModeChip.classList.remove("active"); // もう片方の青色を消す
  // HTMLの属性（data-mode）を書き換えることで、CSS側で表示・非表示を切り替えさせます。
  visualPicker.setAttribute("data-mode", "svg");
});

btnModeChip.addEventListener("click", () => {
  btnModeChip.classList.add("active");
  btnModeSvg.classList.remove("active");
  visualPicker.setAttribute("data-mode", "chip");
});

// --- 前後切り替え処理 ---
const btnFront = document.getElementById("btn-front");
const btnBack = document.getElementById("btn-back");
const viewFront = document.getElementById("front-view");
const viewBack = document.getElementById("back-view");

btnFront.addEventListener("click", () => {
  btnFront.classList.add("active");
  btnBack.classList.remove("active");
  viewFront.style.display = "block"; // 前面を表示（block）
  viewBack.style.display = "none"; // 背面を非表示（none）
});

btnBack.addEventListener("click", () => {
  btnBack.classList.add("active");
  btnFront.classList.remove("active");
  viewBack.style.display = "block"; // 背面を表示
  viewFront.style.display = "none"; // 前面を非表示
});

// ==========================================
// --- 1. 文章生成ロジック（メインの頭脳） ---
// ==========================================
// 選択状況（state）を見て、最終的なテキストを作る関数です。部品がクリックされるたびに呼ばれます。
function updateGeneratedText() {
  // Set（セット）のままでは操作しにくいので、Array（配列：普通のリスト）に変換します。
  let partsArray = Array.from(state.selectedParts);

  // 【便利機能】右と左が揃ったら「両〜」に変換する賢い処理
  // もし（if）右袖と左袖の両方がリストに入っていたら…
  if (partsArray.includes("右袖") && partsArray.includes("左袖")) {
    // 右袖と左袖をリストから一度取り除き…
    partsArray = partsArray.filter((p) => p !== "右袖" && p !== "左袖");
    // リストの先頭に「両袖」を追加します。
    partsArray.unshift("両袖");
  }
  if (partsArray.includes("右袖口") && partsArray.includes("左袖口")) {
    partsArray = partsArray.filter((p) => p !== "右袖口" && p !== "左袖口");
    partsArray.unshift("両袖口");
  }

  // リストの要素を「、」で繋いで1つの文字列にします。（例：["右袖", "前身頃"] → "右袖、前身頃"）
  const partList = partsArray.join("、");
  const damageList = Array.from(state.damages).join("、");

  let text = "";

  // ダメージ内容が1つでも選択されている場合
  if (damageList) {
    // 程度に合わせて文章の形を変えます
    if (state.severity === "全体") {
      // 「A ? B : C」という書き方は、「AがあるならB、ないならC」という便利な省略記法（三項演算子）です。
      text = partList
        ? `${partList}全体に${damageList}あり。`
        : `全体的に${damageList}あり。`;
    } else if (state.severity === "一部") {
      text = partList
        ? `${partList}の一部に${damageList}あり。`
        : `一部に${damageList}あり。`;
    } else if (state.severity === "所々") {
      text = partList
        ? `${partList}に所々${damageList}があり。`
        : `所々${damageList}あり。`;
    } else if (state.severity === "多数") {
      text = partList
        ? `${partList}に${damageList}が多数あり。`
        : `${damageList}が多数あり。`;
    } else {
      // 範囲・程度が選択されていない場合
      text = partList
        ? `${partList}に${damageList}あり。`
        : `${damageList}あり。`;
    }
  }
  // ダメージは選ばれていないが、部位だけが選ばれている場合
  else if (partList) {
    text = `${partList}に損傷あり。`;
  }

  // 出来上がった文章をテキストエリアにセットします。
  resultTextArea.value = text;
}

// ==========================================
// --- 2. イベントリスナー：部位の選択 ---
// ==========================================
// forEach は「リストの中身全部に対して同じ処理をするよ」という命令です。
selectableParts.forEach((part) => {
  // ① 部位（図形やチップ）がクリックされた時の処理
  part.addEventListener("click", () => {
    // dataset.part は、HTMLで書いた data-part="〇〇" の中身（〇〇）を取得する命令です。
    const partName = part.dataset.part;
    if (!partName) return; // 名前がなければ何もしない

    // すでに選ばれているか（Setの中に存在するか）をチェックします。
    if (state.selectedParts.has(partName)) {
      // 存在する場合は、選ばれたリストから削除し、
      state.selectedParts.delete(partName);
      // 同じ名前（data-part）を持つ全ての部品（画像とチップ両方）から "selected" クラスを外して色を元に戻します。
      document
        .querySelectorAll(`[data-part="${partName}"]`)
        .forEach((p) => p.classList.remove("selected"));
    } else {
      // まだ選ばれていない場合は、リストに追加し、
      state.selectedParts.add(partName);
      // 同じ名前を持つ全ての部品に "selected" クラスを付けて赤くします。
      document
        .querySelectorAll(`[data-part="${partName}"]`)
        .forEach((p) => p.classList.add("selected"));
    }

    // パネルの下部にある「選択部位：〇〇」のテキストを更新します。
    const partsArray = Array.from(state.selectedParts);
    selectedPartNameEl.textContent = `選択部位: ${partsArray.length > 0 ? partsArray.join("、") : "なし"}`;

    // 文章を作り直します。
    updateGeneratedText();
  });

  // ② マウスが乗った時の処理（ハイライト連動）
  part.addEventListener("mouseenter", () => {
    const partName = part.dataset.part;
    if (partName) {
      // マウスが乗った部位と同じ名前の部品すべてに "hovered" クラスを付けて、うっすら色を変えます。
      document
        .querySelectorAll(`[data-part="${partName}"]`)
        .forEach((p) => p.classList.add("hovered"));
    }
  });

  // ③ マウスが離れた時の処理
  part.addEventListener("mouseleave", () => {
    const partName = part.dataset.part;
    if (partName) {
      // "hovered" クラスを外して色を元に戻します。
      document
        .querySelectorAll(`[data-part="${partName}"]`)
        .forEach((p) => p.classList.remove("hovered"));
    }
  });
});

// ==========================================
// --- 3. 損傷内容（複数選択）の処理 ---
// ==========================================
damageChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const value = chip.dataset.value;
    // 部位の時と同じように、すでに選ばれていれば消す、選ばれていなければ追加する、という処理です。
    if (state.damages.has(value)) {
      state.damages.delete(value);
      chip.classList.remove("selected");
    } else {
      state.damages.add(value);
      chip.classList.add("selected");
    }
    updateGeneratedText();
  });
});

// ==========================================
// --- 4. 程度（単一選択）の処理 ---
// ==========================================
severityChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const value = chip.dataset.value;

    // ★「多数」が押されたときの特別処理（定型文モード）
    if (value === "多数") {
      if (state.severity === "多数") {
        // すでに「多数」が選ばれている状態で押したら、すべてをリセット（キャンセル）
        resetAllSelections();
      } else {
        // 初めて「多数」を押したときは、他の選択をすべて消してから「多数」をセットする
        resetAllSelections();
        state.severity = "多数";
        chip.classList.add("selected");
        // 定型文を直接テキストエリアに入れます。
        resultTextArea.value = "多数ダメージあり。";
      }
      return; // 処理をここで終わらせる（下の通常の文章生成にいかせないため）
    }

    // --- 通常の処理（全体・一部・所々） ---
    if (state.severity === value) {
      // すでに選ばれているものを押したらキャンセル（空っぽにする）
      state.severity = "";
      chip.classList.remove("selected");
    } else {
      // 別のものが選ばれたら、一度すべてのチップの色を消してから、新しく選ばれたものだけ色を付けます（単一選択の仕組み）
      severityChips.forEach((c) => c.classList.remove("selected"));
      state.severity = value;
      chip.classList.add("selected");
    }
    updateGeneratedText();
  });
});

// ==========================================
// --- 5. フォームへの転記（Content Scriptへの通信） ---
// ==========================================
// 「async」と「await」は、別のプログラム（ブラウザのタブなど）の応答を「待つ」ための書き方です。
copyBtn.addEventListener("click", async () => {
  const text = resultTextArea.value;
  if (!text) return; // テキストが空なら何もしない

  try {
    // 現在開いているアクティブなタブ（World Switchの画面など）の情報を取得します。
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // 万が一、対象のタブが取得できなかった場合は処理を中断
    if (!tab || !tab.id) return;

    // 取得したタブに対して、"FILL_FORM" という名前のメッセージと、入力したいテキストを送ります。
    chrome.tabs.sendMessage(
      tab.id,
      { type: "FILL_FORM", text: text },
      (response) => {
        // ★ エラーのハンドリング（握りつぶし）
        // メッセージの受け取り手（対象サイト）がいないとエラーになるので、それを検知します。
        if (chrome.runtime.lastError) {
          console.warn(
            "対象のサイトが開かれていないか、読み込みが完了していません。",
          );

          // エラーの場合はボタンを赤くしてユーザーに知らせます。
          copyBtn.textContent = "対象ページを開いてください";
          copyBtn.style.backgroundColor = "#dc3545";
          setTimeout(() => {
            copyBtn.textContent = "フォームに転記";
            copyBtn.style.backgroundColor = "";
          }, 2000); // 2秒（2000ミリ秒）後に元に戻す
          return;
        }

        // 対象サイトから「成功したよ！」というお返事（response.success）が来た場合の処理
        if (response?.success) {
          copyBtn.textContent = "転記完了！";
          copyBtn.style.backgroundColor = "#28a745"; // 成功の緑色

          // 転記が終わったので、アプリの状態をリセットして次の商品に備えます。
          resetAllSelections();

          setTimeout(() => {
            copyBtn.textContent = "フォームに転記";
            copyBtn.style.backgroundColor = "";
          }, 1000); // 1秒後に元に戻す
        }
      },
    );
  } catch (error) {
    // 予期せぬエラーが起きた時はコンソールに記録します。
    console.error("Messaging error:", error);
  }
});

// ==========================================
// --- 6. クリアボタン ---
// ==========================================
clearBtn.addEventListener("click", () => {
  // リセット用の関数を呼び出すだけ
  resetAllSelections();
});

// ==========================================
// --- 7. 選択状態をリセットする共通関数 ---
// ==========================================
// クリアボタンを押した時と、転記が成功した時の両方で使うため、処理を1つの関数にまとめています。
function resetAllSelections() {
  state.selectedParts.clear(); // Setの中身を空にする
  state.damages.clear();
  state.severity = "";

  selectedPartNameEl.textContent = "選択部位: なし";

  // UI（画面）のハイライト色をすべて消します
  selectableParts.forEach((p) => p.classList.remove("selected", "hovered"));
  damageChips.forEach((c) => c.classList.remove("selected"));
  severityChips.forEach((c) => c.classList.remove("selected"));

  // 文章を再生成します（何も選ばれていない状態なので、テキストエリアも空になります）
  updateGeneratedText();
}

// ==========================================
// --- 8. お気に入り機能（画面切り替えとデータ管理） ---
// ==========================================

// --- UI要素の取得 ---
const mainView = document.getElementById("main-view");
const favListView = document.getElementById("favorite-list-view");
const favAddView = document.getElementById("favorite-add-view");

const btnFavOpen = document.getElementById("btn-favorite-open");
const btnFavBackMain = document.getElementById("btn-fav-back-main");
const btnFavAddNew = document.getElementById("btn-fav-add-new");
const btnFavBackList = document.getElementById("btn-fav-back-list");
const btnFavSave = document.getElementById("btn-fav-save");
const favCopyBtn = document.getElementById("fav-copy-btn");

const newFavText = document.getElementById("new-fav-text");
const favItemsContainer = document.getElementById("favorite-items-container");

// ★設定：登録できる最大件数（ご要望により現状は0件に設定）
// ここを1以上の数字に変えれば、実際に登録できるようになります。
const MAX_FAVORITES = 10;

let favoritesList = []; // 保存されたお気に入りを保持する配列
let selectedFavText = ""; // 転記用に選択されたテキスト

// --- 画面切り替え関数 ---
function showView(viewElement) {
  mainView.style.display = "none";
  favListView.style.display = "none";
  favAddView.style.display = "none";
  viewElement.style.display = "block";
}

// 1. ハートボタン → お気に入り一覧へ
btnFavOpen.addEventListener("click", () => {
  loadFavorites(); // ストレージから読み込み
  showView(favListView);
});

// 2. 戻るボタン（一覧からメインへ）
btnFavBackMain.addEventListener("click", () => {
  showView(mainView);
});

// 3. ＋ボタン → 登録画面へ
btnFavAddNew.addEventListener("click", () => {
  newFavText.value = ""; // 入力欄をリセット
  showView(favAddView);
});

// 4. 戻るボタン（登録画面から一覧へ）
btnFavBackList.addEventListener("click", () => {
  showView(favListView);
});

// --- データ保存処理 (`chrome.storage.local` を使用) ---
btnFavSave.addEventListener("click", () => {
  const textToSave = newFavText.value.trim();

  if (!textToSave) {
    alert("文字が入力されていません。");
    return;
  }

  // ★上限チェック
  if (favoritesList.length >= MAX_FAVORITES) {
    alert(
      `現在は登録上限（${MAX_FAVORITES}件）に達しているため、新しい文字を登録できません。`,
    );
    return;
  }

  // リストに追加して保存
  favoritesList.push(textToSave);
  chrome.storage.local.set({ savedFavorites: favoritesList }, () => {
    alert("保存しました！");
    loadFavorites(); // リストを再描画
    showView(favListView); // 一覧画面に戻る
  });
});

// --- データ読み込み・リスト描画処理 ---
function loadFavorites() {
  chrome.storage.local.get(["savedFavorites"], (result) => {
    favoritesList = result.savedFavorites || [];
    renderFavoritesList();
  });
}

function renderFavoritesList() {
  favItemsContainer.innerHTML = "";
  selectedFavText = ""; // 選択状態をリセット

  if (favoritesList.length === 0) {
    favItemsContainer.innerHTML =
      "<p style='color:#999; font-size:14px; text-align:center;'>登録された文字はありません</p>";
    return;
  }

  favoritesList.forEach((text, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "fav-item";
    itemDiv.textContent = text;

    // アイテムをクリックした時の処理（選択状態にする）
    itemDiv.addEventListener("click", () => {
      // 全ての選択状態を解除
      document
        .querySelectorAll(".fav-item")
        .forEach((el) => el.classList.remove("selected"));
      // クリックしたものだけ選択状態にする
      itemDiv.classList.add("selected");
      selectedFavText = text;
    });

    favItemsContainer.appendChild(itemDiv);
  });
}

// --- お気に入りからの転記処理 ---
favCopyBtn.addEventListener("click", async () => {
  if (!selectedFavText) {
    alert("転記する文字をリストから選択してください。");
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      { type: "FILL_FORM", text: selectedFavText },
      (response) => {
        if (chrome.runtime.lastError) {
          alert("対象のページが開かれていないか、読み込みが完了していません。");
          return;
        }
        if (response?.success) {
          favCopyBtn.textContent = "転記完了！";
          favCopyBtn.style.backgroundColor = "#28a745";
          setTimeout(() => {
            favCopyBtn.textContent = "選択した文字を転記";
            favCopyBtn.style.backgroundColor = "#00a0e9";
          }, 1500);
        }
      },
    );
  } catch (error) {
    console.error("Messaging error:", error);
  }
});
