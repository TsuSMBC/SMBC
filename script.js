const LIFF_ID = "LIFFアプリIDをここに入力"; // LINE DeveloperのLIFF IDを入力
const GAS_ENDPOINT = "Google Apps ScriptのエンドポイントURLをここに入力"; // GASのWebアプリURL

document.addEventListener("DOMContentLoaded", () => {
  // LIFFの初期化
  liff.init({ liffId: LIFF_ID })
    .then(() => {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
      loadNameOptions();
    })
    .catch(err => {
      console.error("LIFF初期化エラー: ", err);
      displayMessage("LIFF初期化に失敗しました。");
    });

  // 登録ボタンのイベントリスナー
  document.getElementById("registerButton").addEventListener("click", registerUser);
});

// 名前選択肢を取得して表示
function loadNameOptions() {
  fetch(`${GAS_ENDPOINT}?action=getNameOptions`)
    .then(response => response.json())
    .then(data => {
      if (data && data.names) {
        const selectElement = document.getElementById("nameSelect");
        data.names.forEach(name => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          selectElement.appendChild(option);
        });
      } else {
        displayMessage("選択可能な名前がありません。");
      }
    })
    .catch(err => {
      console.error("名前選択肢取得エラー: ", err);
      displayMessage("名前選択肢の取得に失敗しました。");
    });
}

// ユーザーを登録
function registerUser() {
  const name = document.getElementById("nameSelect").value;

  if (!name) {
    displayMessage("名前を選択してください。");
    return;
  }

  liff.getProfile()
    .then(profile => {
      const userId = profile.userId;
      return fetch(GAS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "registerUser", name, userId })
      });
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayMessage("登録が完了しました。");
      } else {
        displayMessage("登録に失敗しました。すでに登録されている可能性があります。");
      }
    })
    .catch(err => {
      console.error("登録エラー: ", err);
      displayMessage("登録に失敗しました。");
    });
}

// メッセージを表示
function displayMessage(message) {
  document.getElementById("message").textContent = message;
}
