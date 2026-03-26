// ==========================================
// --- アプリの記憶領域（状態管理） ---
// ==========================================
let state = {
  category: "ジャケット",
  selectedParts: new Set(),
  damages: new Set(),
  severity: "",
};

const categoryParts = {
  ジャケット: {
    front: [
      "首まわり",
      "前身頃",
      "左袖",
      "右袖",
      "左袖口",
      "右袖口",
      "前すそ",
      "すそ",
    ],
    back: ["首まわり", "後襟", "後身頃", "後すそ", "後左袖", "後右袖"],
  },
  パンツ: {
    front: ["ウエスト", "フロント", "左足", "右足", "左すそ", "右すそ"],
    back: ["ウエスト", "ヒップ", "後左足", "後右足", "左すそ", "右すそ"],
  },
  セット: {
    front: [
      "首まわり",
      "前身頃",
      "左袖",
      "右袖",
      "左袖口",
      "右袖口",
      "前すそ",
      "すそ",
      "ウエスト",
      "フロント",
      "左足",
      "右足",
      "左すそ",
      "右すそ",
    ],
    back: [
      "首まわり",
      "後襟",
      "後身頃",
      "後すそ",
      "後左袖",
      "後右袖",
      "ウエスト",
      "ヒップ",
      "後左足",
      "後右足",
      "左すそ",
      "右すそ",
    ],
  },
  くつ: {
    front: [],
  },
  帽子: {
    front: [],
  },
  バッグ: {
    front: [],
  },
  財布・小物: {
    front: [],
  },
  ファッション雑貨: {
    front: [],
  },
  時計・ライター: {
    front: [],
  },
  アクセサリー: {
    front: [],
  },
};

const categorySeverities = {
  ジャケット: ["全体", "一部", "所々", "多数", "内側生地"],
  パンツ: ["全体", "一部", "所々", "多数", "内側生地"],
  セット: ["全体", "一部", "所々", "多数", "内側生地"],
  くつ: ["全体", "一部", "所々", "多数", "内側", "ソール"],
  帽子: ["全体", "一部", "所々", "多数"],
  バッグ: ["全体", "一部", "所々", "多数", "外側", "内側", "金具部分"],
  財布・小物: ["全体", "一部", "所々", "多数", "金具部分"],
  ファッション雑貨: ["全体", "一部", "所々", "多数", "金具部分"],
  時計・ライター: ["全体", "一部", "所々", "多数", "金具部分"],
  アクセサリー: ["全体", "一部", "所々", "多数", "金具部分"],
};

const categoryDamages = {
  ジャケット: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "毛羽立ち",
    "毛玉",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
  ],
  パンツ: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "毛羽立ち",
    "毛玉",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
  ],
  セット: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "毛羽立ち",
    "毛玉",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
  ],
  くつ: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "毛羽立ち",
    "毛玉",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
  ],
  帽子: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "毛羽立ち",
    "毛玉",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
  ],
  バッグ: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
    "べたつき",
  ],
  財布・小物: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
    "べたつき",
    "錆び",
  ],
  ファッション雑貨: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "毛羽立ち",
    "毛玉",
    "しわ",
    "穴",
    "糸引き",
    "ほつれ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
    "べたつき",
    "錆び",
  ],
  時計・ライター: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "しわ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
    "べたつき",
    "錆び",
  ],
  アクセサリー: [
    "擦れ",
    "汚れ",
    "破れ",
    "傷",
    "しわ",
    "シミ",
    "日焼け",
    "色あせ",
    "変色",
    "剥がれ",
    "べたつき",
    "錆び",
  ],
};

// ==========================================
// --- DOM要素の取得 ---
// ==========================================
const selectedPartNameEl = document.getElementById("selected-part-name");
const resultTextArea = document.getElementById("result-text");
const copyBtn = document.getElementById("copy-btn");
const clearBtn = document.getElementById("clear-btn");

// ==========================================
// --- SVG読み込み関数 ---
// ==========================================
async function loadSVG(url, containerId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("SVGの読み込みに失敗しました");
    const svgText = await response.text();
    document.getElementById(containerId).innerHTML = svgText;
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// --- 初期化処理（SVG関連） ---
// ==========================================
// 【変更後】最初からあるボタンのイベント（アプリ起動時に1回だけ呼ぶ）
function initStaticInteractions() {
  const btnModeSvg = document.getElementById("btn-mode-svg");
  const btnModeChip = document.getElementById("btn-mode-chip");
  const visualPicker = document.getElementById("visual-picker");
  const btnFront = document.getElementById("btn-front");
  const btnBack = document.getElementById("btn-back");
  const viewFront = document.getElementById("front-view");
  const viewBack = document.getElementById("back-view");

  btnModeSvg.addEventListener("click", () => {
    btnModeSvg.classList.add("active");
    btnModeChip.classList.remove("active");
    visualPicker.setAttribute("data-mode", "svg");
  });

  btnModeChip.addEventListener("click", () => {
    btnModeChip.classList.add("active");
    btnModeSvg.classList.remove("active");
    visualPicker.setAttribute("data-mode", "chip");
  });

  btnFront.addEventListener("click", () => {
    btnFront.classList.add("active");
    btnBack.classList.remove("active");
    viewFront.style.display = "block";
    viewBack.style.display = "none";
  });

  btnBack.addEventListener("click", () => {
    btnBack.classList.add("active");
    btnFront.classList.remove("active");
    viewBack.style.display = "block";
    viewFront.style.display = "none";
  });
}
// 【変更後】部位チップとSVGのイベント（カテゴリが切り替わるたびに呼ぶ）
function bindSelectableParts() {
  const selectableParts = document.querySelectorAll(".selectable-part");

  selectableParts.forEach((part) => {
    // もし既にイベントが付与されていればスキップする等の安全策として、
    // 一度クローンして置き換える手法もありますが、ここでは毎回要素を作り直す前提なのでそのまま付与します
    part.addEventListener("click", () => {
      const partName = part.dataset.part;
      if (!partName) return;

      if (state.selectedParts.has(partName)) {
        state.selectedParts.delete(partName);
        document
          .querySelectorAll(`[data-part="${partName}"]`)
          .forEach((p) => p.classList.remove("selected"));
      } else {
        state.selectedParts.add(partName);
        document
          .querySelectorAll(`[data-part="${partName}"]`)
          .forEach((p) => p.classList.add("selected"));
      }

      const partsArray = Array.from(state.selectedParts);
      selectedPartNameEl.textContent = `選択部位: ${partsArray.length > 0 ? partsArray.join("、") : "なし"}`;
      updateGeneratedText();
    });

    part.addEventListener("mouseenter", () => {
      const partName = part.dataset.part;
      if (partName) {
        document
          .querySelectorAll(`[data-part="${partName}"]`)
          .forEach((p) => p.classList.add("hovered"));
      }
    });

    part.addEventListener("mouseleave", () => {
      const partName = part.dataset.part;
      if (partName) {
        document
          .querySelectorAll(`[data-part="${partName}"]`)
          .forEach((p) => p.classList.remove("hovered"));
      }
    });
  });
}

// ==========================================
// --- チップ生成  ---
// ==========================================
// app.js に追加
function renderChips(categoryName) {
  // 挿入先の要素を取得
  const frontGroup = document.querySelector("#front-view .chip-group");
  const backGroup = document.querySelector("#back-view .chip-group");

  const parts = categoryParts[categoryName];
  if (!parts) return;

  // 現在のチップを一度すべて消去
  frontGroup.innerHTML = "";
  backGroup.innerHTML = "";

  // 前面のチップを生成
  parts.front?.forEach((part) => {
    const btn = document.createElement("button");
    btn.className = "chip selectable-part";
    btn.dataset.part = part;
    btn.textContent = part;
    frontGroup.appendChild(btn);
  });

  // 背面のチップを生成
  parts.back?.forEach((part) => {
    const btn = document.createElement("button");
    btn.className = "chip selectable-part";
    btn.dataset.part = part;
    btn.textContent = part;
    backGroup.appendChild(btn);
  });
}

function renderOptionChips(categoryName) {
  const severityContainer = document.getElementById("severity-chips");
  const damageContainer = document.getElementById("damage-chips");

  // 対象カテゴリのデータがない場合は「ジャケット」をフォールバック（保険）として使う
  const severities =
    categorySeverities[categoryName] || categorySeverities["ジャケット"];
  const damages =
    categoryDamages[categoryName] || categoryDamages["ジャケット"];

  // 程度・範囲のチップを生成
  severityContainer.innerHTML = "";
  severities.forEach((value) => {
    const btn = document.createElement("button");
    btn.className = "chip-single";
    btn.dataset.value = value;
    btn.textContent = value;
    severityContainer.appendChild(btn);
  });

  // 損傷内容のチップを生成
  damageContainer.innerHTML = "";
  damages.forEach((value) => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.dataset.value = value;
    btn.textContent = value;
    damageContainer.appendChild(btn);
  });
}
// ==========================================
// --- 1. 文章生成ロジック ---
// ==========================================
function updateGeneratedText() {
  let partsArray = Array.from(state.selectedParts);

  if (partsArray.includes("右袖") && partsArray.includes("左袖")) {
    partsArray = partsArray.filter((p) => p !== "右袖" && p !== "左袖");
    partsArray.unshift("両袖");
  }
  if (partsArray.includes("右袖口") && partsArray.includes("左袖口")) {
    partsArray = partsArray.filter((p) => p !== "右袖口" && p !== "左袖口");
    partsArray.unshift("両袖口");
  }
  if (partsArray.includes("右足") && partsArray.includes("左足")) {
    partsArray = partsArray.filter((p) => p !== "右足" && p !== "左足");
    partsArray.unshift("両足");
  }
  if (partsArray.includes("右すそ") && partsArray.includes("左すそ")) {
    partsArray = partsArray.filter((p) => p !== "右すそ" && p !== "左すそ");
    partsArray.unshift("両すそ");
  }

  const partList = partsArray.join("、");
  const damageList = Array.from(state.damages).join("、");

  let text = "";

  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // ★ ステップ1：前半部分（部位 ＋ 程度・範囲）を作る
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  let prefix = "";
  if (state.severity === "全体") {
    prefix = partList ? `${partList}全体に` : `全体的に`;
  } else if (state.severity === "一部") {
    prefix = partList ? `${partList}の一部に` : `一部に`;
  } else if (state.severity === "所々") {
    prefix = partList ? `${partList}に所々` : `所々に`;
  } else if (state.severity === "外側") {
    prefix = partList ? `${partList}の外側に` : `外側に`;
  } else if (state.severity === "内側") {
    prefix = partList ? `${partList}の内側に` : `内側に`;
  } else if (state.severity === "多数") {
    prefix = partList ? `${partList}に` : ``;
  } else if (state.severity === "内側生地") {
    prefix = partList ? `${partList}に` : `内側生地に`;
  } else if (state.severity === "ソール") {
    prefix = partList ? `${partList}に` : `ソールに`;
  } else if (state.severity === "金具部分") {
    prefix = partList ? `${partList}に` : `金具部分に`;
  } else {
    // 程度が選ばれていない場合
    prefix = partList ? `${partList}に` : ``;
  }

  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // ★ ステップ2：後半部分（損傷内容）と合体させる
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  if (damageList) {
    if (state.severity === "多数") {
      text = `${prefix}${damageList}が多数あり。`;
    } else {
      text = `${prefix}${damageList}あり。`;
    }
  } else {
    // 損傷内容（ダメージ）がまだ選ばれていない場合
    if (state.severity) {
      // 程度が選ばれていれば、とりあえず前半部分だけを表示する
      if (state.severity === "多数") {
        text = partList
          ? `${partList}に多数のダメージあり。`
          : `多数ダメージあり。`;
      } else {
        text = prefix; // （例：「全体的に」「右袖の外側に」がそのまま表示されます）
      }
    } else if (partList) {
      // 部位だけが選ばれている場合
      text = `${partList}に損傷あり。`;
    }
  }

  resultTextArea.value = text;
} // --- オプションチップ（程度・損傷）にイベントを付与する ---
function bindOptionEvents() {
  // ボタンが作り直されているため、ここで毎回新しく取得し直す
  const damageChips = document.querySelectorAll("#damage-chips .chip");
  const severityChips = document.querySelectorAll(
    "#severity-chips .chip-single",
  );

  // 損傷内容（複数選択）の処理
  damageChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.dataset.value;
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

  // 程度（単一選択）の処理
  severityChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const value = chip.dataset.value;

      // 「多数」の特別処理
      if (value === "多数") {
        if (state.severity === "多数") {
          resetAllSelections();
        } else {
          resetAllSelections();
          state.severity = "多数";
          chip.classList.add("selected");
          resultTextArea.value = "多数ダメージあり。";
        }
        return;
      }

      // 通常の選択処理
      if (state.severity === value) {
        state.severity = "";
        chip.classList.remove("selected");
      } else {
        severityChips.forEach((c) => c.classList.remove("selected"));
        state.severity = value;
        chip.classList.add("selected");
      }
      updateGeneratedText();
    });
  });
}
// ==========================================
// --- 5. フォームへの転記 ---
// ==========================================
copyBtn.addEventListener("click", async () => {
  const text = resultTextArea.value;
  if (!text) return;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(
      tab.id,
      { type: "FILL_FORM", text: text },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "対象のサイトが開かれていないか、読み込みが完了していません。",
          );
          copyBtn.textContent = "対象ページを開いてください";
          copyBtn.style.backgroundColor = "#dc3545";
          setTimeout(() => {
            copyBtn.textContent = "フォームに転記";
            copyBtn.style.backgroundColor = "";
          }, 2000);
          return;
        }

        if (response?.success) {
          copyBtn.textContent = "転記完了！";
          copyBtn.style.backgroundColor = "#28a745";

          resetAllSelections();

          setTimeout(() => {
            copyBtn.textContent = "フォームに転記";
            copyBtn.style.backgroundColor = "";
          }, 1000);
        }
      },
    );
  } catch (error) {
    console.error("Messaging error:", error);
  }
});

// ==========================================
// --- 6. クリアボタン ---
// ==========================================
clearBtn.addEventListener("click", () => {
  resetAllSelections();
});

function resetAllSelections() {
  state.selectedParts.clear();
  state.damages.clear();
  state.severity = "";
  selectedPartNameEl.textContent = "選択部位: なし";

  // ここを修正：毎回ドキュメントから探し出してクリアする
  document
    .querySelectorAll(".selectable-part")
    .forEach((p) => p.classList.remove("selected", "hovered"));
  document
    .querySelectorAll("#damage-chips .chip")
    .forEach((c) => c.classList.remove("selected"));
  document
    .querySelectorAll("#severity-chips .chip-single")
    .forEach((c) => c.classList.remove("selected"));

  updateGeneratedText();
}
// ==========================================
// --- 8. お気に入り機能 ---
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
const favViewTitle = document.getElementById("fav-view-title");

const MAX_FAVORITES = 10;

let favoritesList = [];
let selectedFavText = "";
let editingIndex = -1;

function showView(viewElement) {
  mainView.style.display = "none";
  favListView.style.display = "none";
  favAddView.style.display = "none";
  viewElement.style.display = "block";
}

btnFavOpen.addEventListener("click", () => {
  loadFavorites();
  showView(favListView);
});

btnFavBackMain.addEventListener("click", () => {
  showView(mainView);
});

btnFavAddNew.addEventListener("click", () => {
  editingIndex = -1;
  favViewTitle.textContent = "文字を登録";
  newFavText.value = "";
  showView(favAddView);
});

btnFavBackList.addEventListener("click", () => {
  showView(favListView);
});

btnFavSave.addEventListener("click", () => {
  const textToSave = newFavText.value.trim();

  if (!textToSave) {
    showToast("文字が入力されていません。", "error");
    return;
  }

  if (editingIndex === -1) {
    if (favoritesList.length >= MAX_FAVORITES) {
      showToast(`登録上限（${MAX_FAVORITES}件）に達しています。`, "error");
      return;
    }
    favoritesList.push(textToSave);
  } else {
    favoritesList[editingIndex] = textToSave;
  }

  chrome.storage.local.set({ savedFavorites: favoritesList }, () => {
    editingIndex = -1;
    loadFavorites();
    showView(favListView);
    showToast("保存しました！", "success");
  });
});

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
    itemDiv.setAttribute("draggable", "true");

    const handleSpan = document.createElement("span");
    handleSpan.className = "drag-handle";
    handleSpan.textContent = "≡";

    const textSpan = document.createElement("span");
    textSpan.className = "fav-item-text";
    textSpan.textContent = text;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "fav-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "fav-action-btn edit-btn";
    editBtn.title = "編集";
    editBtn.innerHTML = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#4B4B4B" d="M497.209,88.393l-73.626-73.6c-19.721-19.712-51.656-19.729-71.376-0.017L304.473,62.51L71.218,295.816c-9.671,9.662-17.066,21.341-21.695,34.193L2.238,461.6c-4.93,13.73-1.492,29.064,8.818,39.372c10.318,10.317,25.659,13.739,39.39,8.801l131.565-47.286c12.851-4.628,24.539-12.032,34.201-21.694l220.801-220.817l0.017,0.017l12.481-12.498l47.699-47.725l0.026-0.018C516.861,140.039,516.939,108.14,497.209,88.393z M170.064,429.26l-83.822,30.133l-33.606-33.607l30.116-83.831c0.224-0.604,0.517-1.19,0.758-1.792l88.339,88.339C171.245,428.752,170.676,429.036,170.064,429.26z M191.242,415.831c-1.19,1.19-2.457,2.284-3.741,3.362l-94.674-94.674c1.069-1.276,2.163-2.552,3.352-3.741L327.685,89.22l95.079,95.08L191.242,415.831z M472.247,134.808l-35.235,35.244l-1.767,1.767l-95.08-95.079l37.003-37.003c5.921-5.896,15.506-5.905,21.454,0.017l73.625,73.609c5.921,5.904,5.93,15.489-0.026,21.47L472.247,134.808z"/></svg>`;
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editingIndex = index;
      favViewTitle.textContent = "文字を編集";
      newFavText.value = text;
      showView(favAddView);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "fav-action-btn delete-btn";
    deleteBtn.title = "削除";
    deleteBtn.innerHTML = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#4B4B4B" d="M439.114,69.747c0,0,2.977,2.1-43.339-11.966c-41.52-12.604-80.795-15.309-80.795-15.309l-2.722-19.297C310.387,9.857,299.484,0,286.642,0h-30.651h-30.651c-12.825,0-23.729,9.857-25.616,23.175l-2.722,19.297c0,0-39.258,2.705-80.778,15.309C69.891,71.848,72.868,69.747,72.868,69.747c-10.324,2.849-17.536,12.655-17.536,23.864v16.695h200.66h200.677V93.611C456.669,82.402,449.456,72.596,439.114,69.747z"/><path fill="#4B4B4B" d="M88.593,464.731C90.957,491.486,113.367,512,140.234,512h231.524c26.857,0,49.276-20.514,51.64-47.269l25.642-327.21H62.952L88.593,464.731z M342.016,209.904c0.51-8.402,7.731-14.807,16.134-14.296c8.402,0.51,14.798,7.731,14.296,16.134l-14.492,239.493c-0.51,8.402-7.731,14.798-16.133,14.288c-8.403-0.51-14.806-7.722-14.296-16.125L342.016,209.904z M240.751,210.823c0-8.42,6.821-15.241,15.24-15.241c8.42,0,15.24,6.821,15.24,15.241v239.492c0,8.42-6.821,15.24-15.24,15.24c-8.42,0-15.24-6.821-15.24-15.24V210.823z M153.833,195.608c8.403-0.51,15.624,5.894,16.134,14.296l14.509,239.492c0.51,8.403-5.894,15.615-14.296,16.125c-8.403,0.51-15.624-5.886-16.134-14.288l-14.509-239.493C139.026,203.339,145.43,196.118,153.833,195.608z"/></svg>`;
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const isConfirmed = await showConfirm("登録した文字を削除しますか？", e);
      if (isConfirmed) {
        favoritesList.splice(index, 1);
        chrome.storage.local.set({ savedFavorites: favoritesList }, () => {
          showToast("削除しました", "success");
          loadFavorites();
        });
      }
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    itemDiv.appendChild(handleSpan);
    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(actionsDiv);

    itemDiv.addEventListener("click", () => {
      document
        .querySelectorAll(".fav-item")
        .forEach((el) => el.classList.remove("selected"));
      itemDiv.classList.add("selected");
      selectedFavText = text;
    });

    itemDiv.addEventListener("dragstart", () => {
      itemDiv.classList.add("dragging");
    });

    itemDiv.addEventListener("dragend", () => {
      itemDiv.classList.remove("dragging");
      saveReorderedList();
    });

    favItemsContainer.appendChild(itemDiv);
  });
}

favItemsContainer.addEventListener("dragover", (e) => {
  e.preventDefault();

  const afterElement = getDragAfterElement(favItemsContainer, e.clientY);
  const draggable = document.querySelector(".dragging");

  if (!draggable) return;

  if (draggable.nextElementSibling === afterElement) {
    return;
  }

  const siblings = [
    ...favItemsContainer.querySelectorAll(".fav-item:not(.dragging)"),
  ];
  const oldPositions = new Map();
  siblings.forEach((sibling) => {
    oldPositions.set(sibling, sibling.getBoundingClientRect().top);
  });

  if (afterElement == null) {
    favItemsContainer.appendChild(draggable);
  } else {
    favItemsContainer.insertBefore(draggable, afterElement);
  }

  siblings.forEach((sibling) => {
    const oldTop = oldPositions.get(sibling);
    const newTop = sibling.getBoundingClientRect().top;
    const deltaY = oldTop - newTop;

    if (deltaY !== 0) {
      sibling.style.transform = `translateY(${deltaY}px)`;
      sibling.style.transition = "none";

      requestAnimationFrame(() => {
        sibling.style.transform = "";
        sibling.style.transition =
          "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)";
      });
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".fav-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

function saveReorderedList() {
  const items = document.querySelectorAll(".fav-item .fav-item-text");
  const newList = Array.from(items).map((item) => item.textContent);

  favoritesList = newList;
  chrome.storage.local.set({ savedFavorites: favoritesList }, () => {});
}

favCopyBtn.addEventListener("click", async () => {
  if (!selectedFavText) {
    showToast("転記する文字を選択してください。", "error");
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
          showToast("ページが読み込まれていません。", "error");
          return;
        }
        if (response?.success) {
          favCopyBtn.textContent = "転記完了！";
          favCopyBtn.style.backgroundColor = "#28a745";

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
function showToast(message, type = "info") {
  let parentElement;
  if (favAddView.style.display === "block") {
    parentElement = document.querySelector(
      "#favorite-add-view .form-container",
    );
  } else if (favListView.style.display === "block") {
    parentElement = document.getElementById("output-area-fav");
  } else {
    parentElement = document.getElementById("output-area");
  }

  const existingToast = parentElement.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  parentElement.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

function showConfirm(message, event = null) {
  return new Promise((resolve) => {
    const modal = document.getElementById("custom-confirm");
    const modalContent = modal.querySelector(".modal-content");
    const msgEl = document.getElementById("confirm-message");
    const btnOk = document.getElementById("confirm-ok");
    const btnCancel = document.getElementById("confirm-cancel");

    msgEl.textContent = message;

    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      let topPos = rect.bottom + 8;

      if (topPos > window.innerHeight - 150) {
        topPos = rect.top - 140;
      }
      modalContent.style.top = topPos + "px";
    } else {
      modalContent.style.top = "150px";
    }

    modal.style.display = "block";

    btnOk.onclick = () => {
      modal.style.display = "none";
      resolve(true);
    };

    btnCancel.onclick = () => {
      modal.style.display = "none";
      resolve(false);
    };
  });
}

// --- 10. content.js からのメッセージ受信 ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CATEGORY_DETECTED") {
    console.log("検知したカテゴリ:", message.category);
    changeCategoryUI(message.category);
  }
});

// --- カテゴリに応じてUIを切り替える関数 ---
async function changeCategoryUI(categoryName) {
  if (state.category === categoryName) return;

  state.category = categoryName;
  resetAllSelections();

  // 1. チップを新しいカテゴリのものに書き換える
  renderChips(categoryName);
  renderOptionChips(categoryName);

  // ★修正箇所1：画像を入れるための枠（コンテナ）をHTMLから取得する
  const frontContainer = document.getElementById("front-svg-container");
  const backContainer = document.getElementById("back-svg-container");

  // 猫ちゃんの準備中画像を中央に綺麗に表示するためのHTMLタグ
  const placeholderHTML = `
   <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 10px; box-sizing: border-box;"> <img src="mock-up/coming_soon.png" alt="準備中" style="width: 100%; opacity: 0.7; border-radius: 8px;">
  `;

  if (categoryName === "ジャケット") {
    await loadSVG("svg/f_jacket.svg", "front-svg-container");
    await loadSVG("svg/b_jacket.svg", "back-svg-container");
  } else {
    // ★修正箇所2：コメントとコードの改行を直し、取得した枠の中に猫ちゃんのHTMLを流し込む
    frontContainer.innerHTML = placeholderHTML;
    backContainer.innerHTML = placeholderHTML;
  }

  // 3. 書き換えたチップとSVGに対して、クリック操作などのイベントを紐付ける
  bindSelectableParts();
  bindOptionEvents();
}

// ==========================================
// --- アプリケーションの起動 ---
// ==========================================
async function startApp() {
  // 静的なボタンのイベントを初期化
  initStaticInteractions();

  // 初回起動時は「ジャケット」としてUIを構築する
  state.category = "ジャケット";
  renderChips("ジャケット");
  renderOptionChips("ジャケット");

  await loadSVG("svg/f_jacket.svg", "front-svg-container");
  await loadSVG("svg/b_jacket.svg", "back-svg-container");

  // 動的な要素にイベントを紐付け
  bindSelectableParts();
  bindOptionEvents();
}

// アプリを起動
startApp();
// --- アプリケーションの起動 ---
async function startApp() {
  // 静的なボタンのイベントを初期化
  initStaticInteractions();

  // 初回起動時は「ジャケット」としてUIを構築する
  state.category = "ジャケット";
  renderChips("ジャケット");
  renderOptionChips("ジャケット"); // ★追加

  await loadSVG("svg/f_jacket.svg", "front-svg-container");
  await loadSVG("svg/b_jacket.svg", "back-svg-container");

  // 動的な要素にイベントを紐付け
  bindSelectableParts();
  bindOptionEvents(); // ★追加
}

startApp();
