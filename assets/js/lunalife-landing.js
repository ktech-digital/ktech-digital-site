document.addEventListener("DOMContentLoaded", function () {
  var androidUrl = "https://play.google.com/store/apps/details?id=com.ktechdigital.lunalife";
  var webAppUrl = "https://lunalife.ktech-digital.com/";
  var ua = navigator.userAgent || "";
  var isAndroid = /Android/i.test(ua);
  var isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  var primaryConfig = {
    label: "Открыть веб-версию",
    href: webAppUrl,
    platform: isIOS ? "ios-web" : "web",
    hint: isIOS
      ? "Откроется веб-версия LunaLife. На iPhone откройте страницу в Safari и добавьте её на экран домой."
      : "Откроется веб-версия LunaLife. Для Android ниже есть отдельная установка через Google Play."
  };

  if (isAndroid) {
    primaryConfig = {
      label: "Установить LunaLife",
      href: androidUrl,
      platform: "android",
      hint: "Откроется страница LunaLife в Google Play."
    };
  }

  document.documentElement.dataset.preferredPlatform = primaryConfig.platform;

  document.querySelectorAll("[data-primary-cta]").forEach(function (link) {
    link.href = primaryConfig.href;
    link.textContent = primaryConfig.label;
    link.dataset.platformTarget = primaryConfig.platform;
  });

  document.querySelectorAll("[data-cta-hint]").forEach(function (element) {
    element.textContent = primaryConfig.hint;
  });

  document.querySelectorAll('[data-platform="android"]').forEach(function (link) {
    link.href = androidUrl;
    link.dataset.platformTarget = "android";
  });

  document.querySelectorAll('[data-platform="ios-web"]').forEach(function (link) {
    link.href = webAppUrl;
    link.dataset.platformTarget = isIOS ? "ios-web" : "web";
  });

  document.querySelectorAll("[data-copy-email]").forEach(function (button) {
    button.addEventListener("click", function () {
      var email = button.getAttribute("data-copy-email");
      if (!email) return;
      var isIconFeedback = button.getAttribute("data-icon-feedback") === "true";

      var defaultLabel = button.getAttribute("data-default-label") || button.textContent;
      button.setAttribute("data-default-label", defaultLabel);
      var defaultTitle = button.getAttribute("data-default-title") || button.getAttribute("title") || "";
      button.setAttribute("data-default-title", defaultTitle);
      var defaultAria = button.getAttribute("data-default-aria") || button.getAttribute("aria-label") || "";
      button.setAttribute("data-default-aria", defaultAria);
      var defaultHtml = button.getAttribute("data-default-html") || button.innerHTML;
      button.setAttribute("data-default-html", defaultHtml);

      function setTemporaryLabel(label) {
        if (isIconFeedback) {
          button.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i><span class="visually-hidden">' + label + "</span>";
          button.classList.add("is-copied");
          button.setAttribute("title", label);
          button.setAttribute("aria-label", label);
          window.setTimeout(function () {
            button.innerHTML = defaultHtml;
            button.classList.remove("is-copied");
            button.setAttribute("title", defaultTitle);
            button.setAttribute("aria-label", defaultAria);
          }, 1600);
          return;
        }

        button.textContent = label;
        window.setTimeout(function () {
          button.textContent = defaultLabel;
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          setTemporaryLabel("Email скопирован");
        }).catch(function () {
          setTemporaryLabel(email);
        });
        return;
      }

      setTemporaryLabel(email);
    });
  });
});
