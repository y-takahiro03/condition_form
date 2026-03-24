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
const favViewTitle = document.getElementById("fav-view-title"); // ★追加：タイトル書き換え用

const MAX_FAVORITES = 10; // 登録できる最大件数

let favoritesList = [];
let selectedFavText = "";
let editingIndex = -1; // ★追加：編集中のインデックス番号（-1の時は「新規登録」）

function showView(viewElement) {
  mainView.style.display = "none";
  favListView.style.display = "none";
  favAddView.style.display = "none";
  viewElement.style.display = "block";
}

// ハートボタン → お気に入り一覧へ
btnFavOpen.addEventListener("click", () => {
  loadFavorites();
  showView(favListView);
});

// 戻るボタン（一覧からメインへ）
btnFavBackMain.addEventListener("click", () => {
  showView(mainView);
});

// ＋ボタン → 新規登録画面へ
btnFavAddNew.addEventListener("click", () => {
  editingIndex = -1; // 新規登録モード
  favViewTitle.textContent = "文字を登録";
  newFavText.value = "";
  showView(favAddView);
});

// 戻るボタン（登録画面から一覧へ）
btnFavBackList.addEventListener("click", () => {
  showView(favListView);
});

// --- データ保存処理 (新規・編集の分岐) ---
btnFavSave.addEventListener("click", () => {
  const textToSave = newFavText.value.trim();

  if (!textToSave) {
    showToast("文字が入力されていません。", "error"); // ← alert から変更
    return;
  }

  if (editingIndex === -1) {
    if (favoritesList.length >= MAX_FAVORITES) {
      showToast(`登録上限（${MAX_FAVORITES}件）に達しています。`, "error"); // ← alert から変更
      return;
    }
    favoritesList.push(textToSave);
  } else {
    favoritesList[editingIndex] = textToSave;
  }

  chrome.storage.local.set({ savedFavorites: favoritesList }, () => {
    showToast("保存しました！", "success"); // ← alert から変更
    editingIndex = -1;
    loadFavorites();
    showView(favListView);
    showToast("保存しました！", "success"); // ★一覧画面に切り替わってからメッセージを出す
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
  selectedFavText = "";

  if (favoritesList.length === 0) {
    favItemsContainer.innerHTML =
      "<p style='color:#999; font-size:14px; text-align:center;'>登録された文字はありません</p>";
    return;
  }

  favoritesList.forEach((text, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "fav-item";

    // 1. テキスト部分
    const textSpan = document.createElement("span");
    textSpan.className = "fav-item-text";
    textSpan.textContent = text;

    // 2. ボタンエリア
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "fav-actions";

    // 編集ボタン（鉛筆アイコン）
    const editBtn = document.createElement("button");
    editBtn.className = "fav-action-btn edit-btn";
    editBtn.title = "編集";
    editBtn.innerHTML = `
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4B4B4B" d="M497.209,88.393l-73.626-73.6c-19.721-19.712-51.656-19.729-71.376-0.017L304.473,62.51L71.218,295.816c-9.671,9.662-17.066,21.341-21.695,34.193L2.238,461.6c-4.93,13.73-1.492,29.064,8.818,39.372c10.318,10.317,25.659,13.739,39.39,8.801l131.565-47.286c12.851-4.628,24.539-12.032,34.201-21.694l220.801-220.817l0.017,0.017l12.481-12.498l47.699-47.725l0.026-0.018C516.861,140.039,516.939,108.14,497.209,88.393z M170.064,429.26l-83.822,30.133l-33.606-33.607l30.116-83.831c0.224-0.604,0.517-1.19,0.758-1.792l88.339,88.339C171.245,428.752,170.676,429.036,170.064,429.26z M191.242,415.831c-1.19,1.19-2.457,2.284-3.741,3.362l-94.674-94.674c1.069-1.276,2.163-2.552,3.352-3.741L327.685,89.22l95.079,95.08L191.242,415.831z M472.247,134.808l-35.235,35.244l-1.767,1.767l-95.08-95.079l37.003-37.003c5.921-5.896,15.506-5.905,21.454,0.017l73.625,73.609c5.921,5.904,5.93,15.489-0.026,21.47L472.247,134.808z"/>
      </svg>
    `;
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // アイテム自体のクリック（転記用選択）が発動するのを防ぐ
      editingIndex = index; // 編集モードに切り替え
      favViewTitle.textContent = "文字を編集";
      newFavText.value = text;
      showView(favAddView);
    });

    // 削除ボタン（ゴミ箱アイコン）
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "fav-action-btn delete-btn";
    deleteBtn.title = "削除";
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4B4B4B" d="M439.114,69.747c0,0,2.977,2.1-43.339-11.966c-41.52-12.604-80.795-15.309-80.795-15.309l-2.722-19.297C310.387,9.857,299.484,0,286.642,0h-30.651h-30.651c-12.825,0-23.729,9.857-25.616,23.175l-2.722,19.297c0,0-39.258,2.705-80.778,15.309C69.891,71.848,72.868,69.747,72.868,69.747c-10.324,2.849-17.536,12.655-17.536,23.864v16.695h200.66h200.677V93.611C456.669,82.402,449.456,72.596,439.114,69.747z"/>
        <path fill="#4B4B4B" d="M88.593,464.731C90.957,491.486,113.367,512,140.234,512h231.524c26.857,0,49.276-20.514,51.64-47.269l25.642-327.21H62.952L88.593,464.731z M342.016,209.904c0.51-8.402,7.731-14.807,16.134-14.296c8.402,0.51,14.798,7.731,14.296,16.134l-14.492,239.493c-0.51,8.402-7.731,14.798-16.133,14.288c-8.403-0.51-14.806-7.722-14.296-16.125L342.016,209.904z M240.751,210.823c0-8.42,6.821-15.241,15.24-15.241c8.42,0,15.24,6.821,15.24,15.241v239.492c0,8.42-6.821,15.24-15.24,15.24c-8.42,0-15.24-6.821-15.24-15.24V210.823z M153.833,195.608c8.403-0.51,15.624,5.894,16.134,14.296l14.509,239.492c0.51,8.403-5.894,15.615-14.296,16.125c-8.403,0.51-15.624-5.886-16.134-14.288l-14.509-239.493C139.026,203.339,145.43,196.118,153.833,195.608z"/>
      </svg>
    `;
    // 【修正後】削除ボタン（ゴミ箱アイコン）のイベント
    deleteBtn.addEventListener("click", async (e) => {
      // ← async を追加
      e.stopPropagation();

      // カスタムダイアログを呼び出して、ユーザーの選択を待つ
      const isConfirmed = await showConfirm("登録した文字を削除しますか？");

      if (isConfirmed) {
        favoritesList.splice(index, 1);
        chrome.storage.local.set({ savedFavorites: favoritesList }, () => {
          showToast("削除しました", "success");
          loadFavorites();
        });
      }
    });

    // 組み立て
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(actionsDiv);

    // アイテム全体をクリックした時の処理（選択状態にする）
    itemDiv.addEventListener("click", () => {
      document
        .querySelectorAll(".fav-item")
        .forEach((el) => el.classList.remove("selected"));
      itemDiv.classList.add("selected");
      selectedFavText = text;
    });

    favItemsContainer.appendChild(itemDiv);
  });
}

// 【修正後】お気に入りからの転記処理
favCopyBtn.addEventListener("click", async () => {
  if (!selectedFavText) {
    showToast("転記する文字を選択してください。", "error"); // ← alert から変更
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
          showToast("ページが読み込まれていません。", "error"); // ← alert から変更
          return;
        }
        if (response?.success) {
          // トースト通知の行を削除（または // でコメントアウト）しました

          favCopyBtn.textContent = "転記完了！";
          favCopyBtn.style.backgroundColor = "#28a745";

          // 選択状態を解除する
          document
            .querySelectorAll(".fav-item")
            .forEach((el) => el.classList.remove("selected"));
          selectedFavText = "";

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

// ==========================================
// --- 9. カスタムUI（トースト通知 ＆ 確認ダイアログ） ---
// ==========================================

// トースト通知を表示する関数
// トースト通知を表示する関数（ボタンの下に追従させる版）
function showToast(message, type = "info") {
  // 現在表示されている画面を判定して、追加先（ボタンが入っている箱）を決める
  let parentElement;
  if (favAddView.style.display === "block") {
    // 登録画面なら「保存」ボタンの下
    parentElement = document.querySelector(
      "#favorite-add-view .form-container",
    );
  } else if (favListView.style.display === "block") {
    // 一覧画面なら「転記」ボタンの下
    parentElement = document.getElementById("output-area-fav");
  } else {
    // メイン画面なら「転記・クリア」ボタンの下
    parentElement = document.getElementById("output-area");
  }

  // すでに表示中の通知があれば消す（連続クリック対策）
  const existingToast = parentElement.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // 新しい通知を作成
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // 親要素の最後（つまりボタンのすぐ下）に追加
  parentElement.appendChild(toast);

  // 3秒後に自動で削除
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}
// 確認ダイアログを表示する関数（Promiseを使って結果を待つ）
function showConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById("custom-confirm");
    const msgEl = document.getElementById("confirm-message");
    const btnOk = document.getElementById("confirm-ok");
    const btnCancel = document.getElementById("confirm-cancel");

    msgEl.textContent = message;
    modal.style.display = "flex"; // モーダルを表示

    // 削除するボタンを押したとき
    btnOk.onclick = () => {
      modal.style.display = "none";
      resolve(true); // true を返す
    };

    // キャンセルボタンを押したとき
    btnCancel.onclick = () => {
      modal.style.display = "none";
      resolve(false); // false を返す
    };
  });
}
