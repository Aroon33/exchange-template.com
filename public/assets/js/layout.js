// ユーザー画面共通のヘッダー＆フッターを読み込む
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("site-header");
  const footerContainer = document.getElementById("site-footer");

  if (headerContainer) {
    fetch("/common/header.html")
      .then(res => res.text())
      .then(html => {
        headerContainer.innerHTML = html;
        // ページごとの active メニュー設定
        const path = location.pathname;
        const navLinks = headerContainer.querySelectorAll(".site-nav .nav-link");
        navLinks.forEach(link => {
          const href = link.getAttribute("href") || "";
          if (path.endsWith(href)) {
            link.classList.add("active");
          }
        });
      })
      .catch(err => console.error("header load error", err));
  }

  if (footerContainer) {
    fetch("/common/footer.html")
      .then(res => res.text())
      .then(html => {
        footerContainer.innerHTML = html;
      })
      .catch(err => console.error("footer load error", err));
  }
});
