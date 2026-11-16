// The award thumbnail shows the inscription; the viewer opens on the blue cover.
function bindCertificateViewer(document) {
  const triggers = document.querySelectorAll("[data-certificate-cover]");
  if (!triggers.length) return;
  const dialog = document.createElement("dialog");
  dialog.className = "certificate-dialog";
  dialog.setAttribute("aria-label", "Award certificate");
  dialog.innerHTML = `
    <div class="certificate-backdrop" aria-hidden="true"></div>
    <div class="certificate-viewer">
      <button class="certificate-book" type="button" aria-expanded="false" aria-label="Open certificate cover">
        <img class="certificate-inside" alt="" />
        <span class="certificate-cover" aria-hidden="true">
          <span class="certificate-cover-top"><img alt="" /></span>
          <span class="certificate-cover-bottom"><img alt="" /></span>
        </span>
      </button>
      <p class="certificate-instruction" aria-live="polite">Click the cover to open</p>
    </div>
    <button class="lightbox-close" type="button" aria-label="Close certificate" autofocus>×</button>`;
  document.body.append(dialog);
  const book = dialog.querySelector(".certificate-book");
  const inside = dialog.querySelector(".certificate-inside");
  const covers = dialog.querySelectorAll(".certificate-cover img");
  const instruction = dialog.querySelector(".certificate-instruction");
  const backdrop = dialog.querySelector(".certificate-backdrop");
  const closeButton = dialog.querySelector(".lightbox-close");
  const view = document.defaultView;
  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)");
  let trigger;
  let bookAnimation;
  let backdropAnimation;
  let loading = false;
  let closing = false;
  const thumbnailTransform = () => {
    const thumbnail = trigger.querySelector("img").getBoundingClientRect();
    const bounds = book.getBoundingClientRect();
    return `translate(${thumbnail.left - bounds.left}px, ${thumbnail.top - bounds.top}px) scale(${thumbnail.width / bounds.width}, ${thumbnail.height / bounds.height})`;
  };
  const setOpen = (open) => {
    book.classList.toggle("is-open", open);
    book.setAttribute("aria-expanded", String(open));
    book.setAttribute("aria-label", open ? "Close certificate cover" : "Open certificate cover");
    instruction.textContent = open ? "Click the certificate to close" : "Click the cover to open";
  };
  book.addEventListener("click", () => setOpen(book.getAttribute("aria-expanded") !== "true"));
  for (const button of triggers) {
    button.addEventListener("click", async () => {
      if (dialog.open || loading) return;
      loading = true;
      trigger = button;
      inside.src = button.querySelector("img").src;
      inside.alt = button.querySelector("img").alt;
      covers.forEach((cover) => { cover.src = button.dataset.certificateCover; });
      try {
        await Promise.all([inside, ...covers].map((image) => image.decode()));
      } catch {
        loading = false;
        return;
      }
      setOpen(false);
      closeButton.style.opacity = "1";
      dialog.showModal();
      document.documentElement.classList.add("lightbox-active");
      const options = {
        duration: reducedMotion.matches ? 0 : 440,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      };
      bookAnimation = book.animate([{ transform: thumbnailTransform() }, { transform: "none" }], options);
      backdropAnimation = backdrop.animate([{ opacity: 0 }, { opacity: 1 }], options);
      loading = false;
    });
  }
  const close = async () => {
    if (!dialog.open || closing) return;
    closing = true;
    const transform = view.getComputedStyle(book).transform;
    const opacity = view.getComputedStyle(backdrop).opacity;
    bookAnimation?.cancel();
    backdropAnimation?.cancel();
    const options = {
      duration: reducedMotion.matches ? 0 : 320,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both",
    };
    bookAnimation = book.animate([{ transform }, { transform: thumbnailTransform() }], options);
    backdropAnimation = backdrop.animate([{ opacity }, { opacity: 0 }], options);
    closeButton.style.opacity = "0";
    await bookAnimation.finished;
    dialog.close();
  };
  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("close", () => {
    bookAnimation?.cancel();
    backdropAnimation?.cancel();
    closing = false;
    document.documentElement.classList.remove("lightbox-active");
    trigger?.focus({ preventScroll: true });
  });
}

if (typeof document !== "undefined") bindCertificateViewer(document);
