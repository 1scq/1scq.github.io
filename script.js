const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const iconClass = (item) => {
  if (item.brand) {
    return `fa-brands ${item.icon}`;
  }
  if (item.regular) {
    return `fa-regular ${item.icon}`;
  }
  return `fa-solid ${item.icon}`;
};

const renderProfileMeta = (contacts) =>
  contacts
    .map((item) => {
      const body = item.href
        ? `<a href="${item.href}">${escapeHtml(item.text)}</a>`
        : `<span>${escapeHtml(item.text)}</span>`;
      return `<li><i class="fa-solid ${item.icon}" aria-hidden="true"></i>${body}</li>`;
    })
    .join("");

const buildProfileSocialLinks = (profile) => [
  {
    label: "Email",
    icon: "fa-envelope",
    href: `mailto:${profile.email}`,
  },
  {
    label: "Google Scholar",
    icon: "fa-graduation-cap",
    href: profile.scholarUrl,
  },
  {
    label: "GitHub",
    icon: "fa-github",
    href: profile.githubUrl,
    brand: true,
  },
  {
    label: "CV",
    icon: "fa-file-lines",
    href: profile.cvUrl,
  },
];

const renderSocialLinks = (links) =>
  links
    .map(
      (item) =>
        `<a href="${item.href}" aria-label="${escapeHtml(item.label)}"><i class="${iconClass(item)}" aria-hidden="true"></i></a>`
    )
    .join("");

const renderNews = (items) =>
  items
    .map(
      (item) => `
        <div class="news-row">
          <time>${escapeHtml(item.date)}</time>
          <div>${item.text}</div>
        </div>
      `
    )
    .join("");

const renderExperience = (items) =>
  items
    .map(
      (item) => `
        <a
          class="experience-item"
          href="${escapeHtml(item.url || "#")}"
          target="_blank"
          rel="noreferrer"
          aria-label="${escapeHtml(`${item.institution}, ${item.role}`)}"
        >
          ${
            item.logo
              ? `<img class="experience-logo" src="${escapeHtml(item.logo)}" alt="${escapeHtml(
                  item.logoAlt || item.institution
                )}" />`
              : ""
          }
          <div class="experience-copy">
            <h3>
              <span>${escapeHtml(item.institution)}</span>
              <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </h3>
            <p>${escapeHtml(item.role)}</p>
            <time>${escapeHtml(item.period)}</time>
          </div>
        </a>
      `
    )
    .join("");

const buildPublicationLinks = (item) =>
  [
    item.paperUrl
      ? { label: "Paper", icon: "fa-file-pdf", href: item.paperUrl, regular: true }
      : null,
    item.projectUrl
      ? { label: "Project", icon: "fa-globe", href: item.projectUrl }
      : null,
    item.codeUrl
      ? { label: "Code", icon: "fa-github", href: item.codeUrl, brand: true }
      : null,
    item.datasetUrl
      ? { label: "Dataset", icon: "fa-database", href: item.datasetUrl }
      : null,
    item.slidesUrl
      ? { label: "Slides", icon: "fa-display", href: item.slidesUrl }
      : null,
  ].filter(Boolean);

const renderPubLinks = (links, index, hasBibtex) => {
  const actionLinks = links
    .map(
      (item) => `
        <a href="${item.href}">
          <i class="${iconClass(item)}" aria-hidden="true"></i>
          <span>${escapeHtml(item.label)}</span>
        </a>
      `
    )
    .join("");

  const bibtexButton = hasBibtex
    ? `
      <button class="bib-toggle" type="button" data-target="bib-${index}">
        <i class="fa-solid fa-quote-left" aria-hidden="true"></i>
        <span>BibTeX</span>
      </button>
    `
    : "";

  return `${actionLinks}${bibtexButton}`;
};

const renderAuthors = (authors) => {
  if (!Array.isArray(authors)) {
    return escapeHtml(authors);
  }

  return authors
    .map((author) => {
      const marker = author.corresponding
        ? `<sup class="corresponding-author" title="Corresponding author"><i class="fa-solid fa-envelope" aria-hidden="true"></i><span class="sr-only">Corresponding author</span></sup>`
        : "";
      const name = author.highlight
        ? `<span class="highlight-author">${escapeHtml(author.name)}</span>`
        : escapeHtml(author.name);
      return `${name}${marker}`;
    })
    .join(", ");
};

const renderPublications = (items) =>
  items
    .map(
      (item, index) => `
        <article class="publication${item.image ? " publication-with-image" : ""}">
          ${
            item.image
              ? `<div class="pub-media">
                  <button class="pub-image-wrapper" type="button" aria-haspopup="dialog" aria-label="${escapeHtml(`View full-size image: ${item.title}`)}">
                    <img class="pub-image" src="${escapeHtml(item.image)}"${item.hoverImage ? ` data-hover-image="${escapeHtml(item.hoverImage)}"` : ""} alt="${escapeHtml(item.imageAlt || item.title)}" loading="lazy" decoding="async" />
                    ${item.coverLabel ? `<span class="pub-cover-overlay" aria-hidden="true">
                      <span class="pub-cover-label">${escapeHtml(item.coverLabel)}</span>
                      <span class="pub-cover-title">${escapeHtml(item.coverTitle || item.title)}</span>
                    </span>` : ""}
                  </button>
                </div>`
              : ""
          }
          <div class="pub-body">
            <h3><a href="${item.pageUrl || "#"}">${escapeHtml(item.title)}</a></h3>
            <p class="pub-venue"><span class="venue-badge">${escapeHtml(item.venue)}</span></p>
            <p class="pub-authors">${renderAuthors(item.authors)}</p>
            <p class="pub-summary">${escapeHtml(item.summary)}</p>
            <div class="pub-links">${renderPubLinks(
              buildPublicationLinks(item),
              index + 1,
              Boolean(item.bibtex)
            )}</div>
            ${
              item.bibtex
                ? `<pre id="bib-${index + 1}" class="bibtex">${escapeHtml(item.bibtex)}</pre>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");

const renderProjects = (items) =>
  items.map((item) => `
    <article class="project-item">
      <a class="project-logo" href="${escapeHtml(item.projectUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`Visit ${item.title}`)}">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(`${item.title} logo`)}" loading="lazy" decoding="async" />
      </a>
      <div class="project-copy">
        <div class="project-heading">
          <h3><a href="${escapeHtml(item.projectUrl)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></h3>
          <a class="project-stars" href="${escapeHtml(item.codeUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${item.title} stars on GitHub`)}">
            <img src="${escapeHtml(item.starsBadge)}" alt="GitHub stars" loading="lazy" />
          </a>
        </div>
        <p>${escapeHtml(item.description)}</p>
        <div class="project-links pub-links">
          <a href="${escapeHtml(item.projectUrl)}" target="_blank" rel="noreferrer">View project <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
          <a href="${escapeHtml(item.codeUrl)}" target="_blank" rel="noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i> GitHub</a>
          ${(item.mediaLinks || []).map((link) => `<a href="${escapeHtml(link.url)}" title="${escapeHtml(link.title)}" target="_blank" rel="noreferrer"><i class="fa-brands fa-weixin" aria-hidden="true"></i> ${escapeHtml(link.name)}</a>`).join("")}
        </div>
      </div>
    </article>
  `).join("");

const renderHonors = (items) =>
  items
    .map(
      (item) => `
        <li class="honor-item">
          ${item.image ? `
            <button class="honor-image-wrapper" type="button" aria-haspopup="dialog" aria-label="${escapeHtml(`View certificate: ${item.competition} — ${item.award}`)}">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(`${item.competition} — ${item.award} certificate`)}" loading="lazy" decoding="async" />
              <span class="honor-image-hint" aria-hidden="true">View certificate <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
            </button>
          ` : `<div class="honor-image-placeholder" aria-hidden="true"><i class="fa-solid fa-award"></i></div>`}
          <div class="honor-card-top">
            <span class="honor-icon" aria-hidden="true"><i class="fa-solid fa-award"></i></span>
            <time datetime="${escapeHtml(item.date.replace("/", "-"))}">${escapeHtml(item.date)}</time>
          </div>
          <div class="honor-copy">
            <div class="honor-heading">
              <h3>${escapeHtml(item.award)}</h3>
              ${item.role ? `<span class="honor-role">${escapeHtml(item.role)}</span>` : ""}
            </div>
            <p>${escapeHtml(item.competition)}</p>
          </div>
        </li>
      `
    )
    .join("");

const renderSidebar = () => {
  const sidebar = document.querySelector("#sidebar");
  const { profile } = siteData;
  const avatarMarkup = profile.avatarImage
    ? `<img class="avatar-image" src="${profile.avatarImage}" alt="${escapeHtml(profile.name)}" />`
    : escapeHtml(profile.initials);
  sidebar.innerHTML = `
    <div class="sidebar-top">
      <div class="avatar" aria-label="Profile placeholder">${avatarMarkup}</div>
      <h1>${escapeHtml(profile.name)}</h1>
      <p class="role">${escapeHtml(profile.title)}<br />${escapeHtml(profile.affiliation)}</p>
      <ul class="profile-meta">
        ${renderProfileMeta(profile.contacts)}
      </ul>
      <div class="social-links" aria-label="Social links">
        ${renderSocialLinks(buildProfileSocialLinks(profile))}
        <a href="${escapeHtml(profile.wechatQrImage)}" data-wechat-trigger aria-label="WeChat" title="WeChat" aria-haspopup="dialog" aria-controls="wechat-contact"><i class="fa-brands fa-weixin" aria-hidden="true"></i></a>
      </div>
      <nav class="section-nav" aria-label="Section navigation">
        <a href="#about">About</a>
        <a href="#news">News</a>
        <a href="#education">Education</a>
        <a href="#experience">Work Experience</a>
        <a href="#publications">Publications</a>
        <a href="#projects">Open-source Projects</a>
        <a href="#honors">Honors</a>
      </nav>
    </div>
    <p class="copyright">© <span id="current-year"></span> ${escapeHtml(profile.name)}</p>
  `;
};

const renderContent = () => {
  const content = document.querySelector("#content");
  const { about, news, education, workExperience, publications, projects, honors } = siteData;
  content.innerHTML = `
    <section class="intro-grid">
      <section id="about" class="section-block">
        <h2>${escapeHtml(about.title)}</h2>
        ${about.paragraphs.map((text) => `<p>${text}</p>`).join("")}
        <div class="notice">${about.notice}</div>
      </section>
      <section id="news" class="section-block">
        <h2>News</h2>
        <div class="news-scroll-wrapper">
          <div class="news-table">${renderNews(news)}</div>
        </div>
      </section>
    </section>
    <section id="education" class="section-block experience-block">
      <h2>Education</h2>
      <div class="experience-list">${renderExperience(education)}</div>
    </section>
    <section id="experience" class="section-block experience-block">
      <h2>Work Experience</h2>
      <div class="experience-list">${renderExperience(workExperience)}</div>
    </section>
    <section id="publications" class="section-block publications-block">
      <h2>Selected Publications <span>(* equal contribution)</span></h2>
      ${renderPublications(publications)}
    </section>
    <section id="projects" class="section-block projects-block">
      <h2>Open-source Projects</h2>
      ${renderProjects(projects)}
    </section>
    <section id="honors" class="section-block honors-block">
      <h2>Honors & Awards</h2>
      <div id="honors-scroll" class="honors-scroll" tabindex="0" role="region" aria-label="Honors and awards">
        <ul class="honors-list">${renderHonors([...honors.filter((item) => item.image), ...honors.filter((item) => !item.image)])}</ul>
      </div>
    </section>
    <dialog id="wechat-contact" class="wechat-dialog" aria-labelledby="wechat-title" aria-describedby="wechat-description">
      <div class="wechat-heading">
        <h2 id="wechat-title">Connect on WeChat</h2>
        <button class="wechat-close" type="button" aria-label="Close WeChat QR code" autofocus><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>
      <p id="wechat-description">Scan the QR code to add me on WeChat.</p>
      <img class="wechat-qr" src="${escapeHtml(siteData.profile.wechatQrImage)}" alt="Danny's WeChat contact QR code" />
    </dialog>
    <dialog class="image-lightbox" aria-label="Enlarged image">
      <div class="lightbox-backdrop" aria-hidden="true"></div>
      <img class="lightbox-image" alt="" />
      <button class="lightbox-close" type="button" aria-label="Close enlarged image" autofocus>
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </dialog>
  `;
};

const bindWeChatDialog = () => {
  const dialog = document.querySelector("#wechat-contact");
  let trigger;
  document.querySelectorAll("[data-wechat-trigger]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (dialog.open) return;
      trigger = link;
      dialog.showModal();
      document.documentElement.classList.add("wechat-active");
    });
  });
  dialog.querySelector(".wechat-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    )) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("wechat-active");
    trigger?.focus({ preventScroll: true });
  });
};

const bindPublicationHover = () => {
  document.querySelectorAll(".pub-image[data-hover-image]").forEach((image) => {
    const button = image.closest(".pub-image-wrapper");
    const poster = image.getAttribute("src");
    let hovered = false;
    let focused = false;
    const update = () => {
      image.src = hovered || focused ? image.dataset.hoverImage : poster;
    };
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      hovered = true;
      update();
    });
    button.addEventListener("pointerleave", () => { hovered = false; update(); });
    button.addEventListener("focus", () => { focused = true; update(); });
    button.addEventListener("blur", () => { focused = false; update(); });
  });
};

const bindImageLightbox = () => {
  const dialog = document.querySelector(".image-lightbox");
  const image = dialog.querySelector(".lightbox-image");
  const backdrop = dialog.querySelector(".lightbox-backdrop");
  const closeButton = dialog.querySelector(".lightbox-close");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let trigger;
  let imageAnimation;
  let backdropAnimation;
  let closing = false;

  const thumbnailTransform = () => {
    const thumbnail = trigger.querySelector("img").getBoundingClientRect();
    // Measure the final image bounds independently of its current animation.
    const width = image.offsetWidth;
    const height = image.offsetHeight;
    const left = image.offsetLeft;
    const top = image.offsetTop;
    return `translate(${thumbnail.left - left}px, ${thumbnail.top - top}px) scale(${thumbnail.width / width}, ${thumbnail.height / height})`;
  };

  const close = async () => {
    if (!dialog.open || closing) return;
    closing = true;
    const currentTransform = getComputedStyle(image).transform;
    const currentOpacity = getComputedStyle(backdrop).opacity;
    imageAnimation?.cancel();
    backdropAnimation?.cancel();
    const options = {
      duration: reducedMotion.matches ? 0 : 320,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both",
    };
    imageAnimation = image.animate(
      [{ transform: currentTransform }, { transform: thumbnailTransform() }],
      options
    );
    backdropAnimation = backdrop.animate(
      [{ opacity: currentOpacity }, { opacity: 0 }],
      options
    );
    closeButton.style.opacity = "0";
    await imageAnimation.finished;
    dialog.close();
    document.documentElement.classList.remove("lightbox-active");
    imageAnimation.cancel();
    backdropAnimation.cancel();
    trigger.focus({ preventScroll: true });
    closing = false;
  };

  document.querySelectorAll(".pub-image-wrapper, .honor-image-wrapper").forEach((button) => {
    button.addEventListener("click", async () => {
      if (dialog.open) return;
      const thumbnail = button.querySelector("img");
      image.src = thumbnail.currentSrc || thumbnail.src;
      image.alt = thumbnail.alt;
      try {
        await image.decode();
      } catch {
        return;
      }
      if (dialog.open) return;
      trigger = button;
      document.documentElement.classList.add("lightbox-active");
      closeButton.style.opacity = "1";
      dialog.showModal();
      const options = {
        duration: reducedMotion.matches ? 0 : 440,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      };
      imageAnimation = image.animate(
        [{ transform: thumbnailTransform() }, { transform: "none" }],
        options
      );
      backdropAnimation = backdrop.animate([{ opacity: 0 }, { opacity: 1 }], options);
    });
  });

  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
};

const bindBibtexToggle = () => {
  document.querySelectorAll(".bib-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const bib = document.getElementById(targetId);
      const label = button.querySelector("span");
      if (!bib || !label) {
        return;
      }

      bib.classList.toggle("open");
      label.textContent = bib.classList.contains("open") ? "Hide BibTeX" : "BibTeX";
    });
  });
};

const bindHonorsScroll = () => {
  const viewport = document.querySelector(".honors-scroll");
  const list = viewport.querySelector(".honors-list");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const originals = [...list.children];
  if (!originals.length) {
    return;
  }
  originals.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("button").forEach((control) => { control.tabIndex = -1; });
    list.append(clone);
  });
  let paused = motion.matches;
  let hovered = false;
  let focused = false;
  let touching = false;
  let visible = false;
  let lastTime = 0;
  let position = viewport.scrollLeft;
  let frame;
  const canRun = () => !paused && !hovered && !focused && !touching && visible && !document.hidden && !document.querySelector(".image-lightbox").open;
  const tick = (time) => {
    if (canRun()) {
      const distance = list.children[originals.length].offsetLeft - originals[0].offsetLeft;
      position += Math.min(time - lastTime, 64) * 0.028;
      if (distance > 0) position %= distance;
      viewport.scrollLeft = position;
    } else {
      position = viewport.scrollLeft;
    }
    lastTime = time;
    frame = requestAnimationFrame(tick);
  };
  viewport.addEventListener("pointerenter", (event) => { hovered = event.pointerType === "mouse"; });
  viewport.addEventListener("pointerleave", () => { hovered = false; });
  viewport.addEventListener("focusin", () => { focused = true; });
  viewport.addEventListener("focusout", () => { focused = false; });
  viewport.addEventListener("touchstart", () => { touching = true; }, { passive: true });
  viewport.addEventListener("touchend", () => { touching = false; });
  viewport.addEventListener("touchcancel", () => { touching = false; });
  motion.addEventListener("change", () => { paused = motion.matches; });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(viewport);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
  window.addEventListener("pageshow", () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(tick); });
  frame = requestAnimationFrame(tick);
};

const bindActiveNav = () => {
  const navLinks = [...document.querySelectorAll(".section-nav a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = () => {
    const scrollY = window.scrollY + 120;
    let activeId = sections[0]?.id;

    sections.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", isActive);
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });
  window.addEventListener("resize", setActiveLink);
};

const init = () => {
  renderSidebar();
  renderContent();
  document.querySelector("#current-year").textContent = new Date().getFullYear();
  bindBibtexToggle();
  bindHonorsScroll();
  bindPublicationHover();
  bindImageLightbox();
  bindWeChatDialog();
  bindActiveNav();
};

init();
