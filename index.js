const myKey = config.MY_KEY;
function applyCopyToClipboard() {
  const copyBtn = document.querySelector(".copy-btn");

  copyBtn.addEventListener("click", () => {
    var range = document.createRange();
    range.selectNode(document.querySelector(".short p span"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Link copied!");
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
  const currentUrl = tabs[0].url;
  while (currentUrl === undefined) {}
  console.log(currentUrl);
  document.querySelector(".url_1").innerHTML = `${currentUrl}`;

  try {
    fetch(`https://api-ssl.bitly.com/v4/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myKey}`,
      },
      body: JSON.stringify({
        long_url: currentUrl,
      }),
    }).then((res) =>
      res.json().then((data) => {
        while (!data) {}
        document.querySelector(".short p span").innerHTML = `${data.link}`;
        applyCopyToClipboard();
      })
    );
  } catch (e) {
    document.querySelector(
      ".short"
    ).innerHTML = `<p>Shortend URL = ${currentUrl}</p>
    <img class="copy-btn" src="icon.png" alt="">
    `;
    console.log(e);
  }
});
