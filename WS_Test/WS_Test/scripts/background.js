// 拡張機能のアイコンをクリックした時に、サイドパネルを開く設定
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
