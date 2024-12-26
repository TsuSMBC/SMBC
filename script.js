const LIFF_ID = "2006724914-VqdBzxeJ"; // LINE DeveloperのLIFF IDを入力
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzHdERL5NRmxnZt4SqweKJVbB9HS0xfwfvih-JNGEHwexOSTn286ng_OzxCLVwtH7aLsA/exec"; // GASのWebアプリURL

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
      displayMessage("エラーが発生しました。数分後にもう一度お試しください。");
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
        displayMessage("全部員の登録が完了しました");
      }
    })
    .catch(err => {
      console.error("選択肢取得エラー: ", err);
      displayMessage("選択肢の取得に失敗しました。");
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
