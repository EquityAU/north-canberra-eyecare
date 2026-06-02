const ADS_CONVERSION_ID = "AW-XXXXXXXXXX";
const ADS_CONVERSION_LABEL = "REPLACE_WITH_GOOGLE_ADS_LABEL";
const META_PIXEL_ID = "000000000000000";

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", ADS_CONVERSION_ID);

!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  t = b.createElement(e);
  t.async = true;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

fbq("init", META_PIXEL_ID);
fbq("track", "PageView");

function trackConversion(action, metadata = {}) {
  const payload = {
    event_category: "lead",
    event_label: action,
    ...metadata,
  };

  gtag("event", "conversion", {
    send_to: `${ADS_CONVERSION_ID}/${ADS_CONVERSION_LABEL}`,
    value: 1.0,
    currency: "AUD",
    ...payload,
  });

  fbq("track", "Lead", {
    content_name: action,
    currency: "AUD",
    value: 1.0,
    ...metadata,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("[data-mobile-toggle]");
  const nav = document.querySelector("[data-nav-links]");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll("[data-conversion]").forEach((element) => {
    element.addEventListener("click", () => {
      trackConversion(element.dataset.conversion || "cta_click", {
        destination: element.getAttribute("href") || "inline",
      });
    });
  });

  document.querySelectorAll("form[data-conversion-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      trackConversion(form.dataset.conversionForm || "form_submit", {
        form_id: form.getAttribute("id") || "lead_form",
      });
      form.reset();
      const status = form.querySelector("[data-form-status]");
      if (status) {
        status.textContent = "Thank you. The tracking event fired and this placeholder form is ready for CRM hookup.";
      }
    });
  });
});
