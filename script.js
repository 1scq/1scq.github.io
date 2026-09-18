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
                    <img class="pub-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.title)}" loading="lazy" decoding="async" />
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

const renderHonors = (items) =>
  items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

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
      </div>
      <nav class="section-nav" aria-label="Section navigation">
        <a href="#about">About</a>
        <a href="#research-interests">Research Interests</a>
        <a href="#news">News</a>
        <a href="#experience">Experience</a>
        <a href="#publications">Publications</a>
        <a href="#honors">Honors</a>
      </nav>
    </div>
    <p class="copyright">© <span id="current-year"></span> ${escapeHtml(profile.name)}</p>
  `;
};

const renderContent = () => {
  const content = document.querySelector("#content");
  const { about, researchInterests, news, experience, publications, honors } = siteData;
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
    <section id="research-interests" class="section-block research-interests-block">
      <h2>Research Interests</h2>
      <ul class="research-interests-list">
        ${researchInterests.map((interest) => `<li>${escapeHtml(interest)}</li>`).join("")}
      </ul>
    </section>
    <section id="experience" class="section-block experience-block">
      <h2>Experience</h2>
      <div class="experience-list">${renderExperience(experience)}</div>
    </section>
    <section id="publications" class="section-block publications-block">
      <h2>Selected Publications <span>(* equal contribution)</span></h2>
      ${renderPublications(publications)}
    </section>
    <section id="honors" class="section-block honors-block">
      <h2>Honors & Awards</h2>
      <ul class="honors-list">${renderHonors(honors)}</ul>
    </section>
    <dialog class="image-lightbox" aria-label="Enlarged publication image">
      <div class="lightbox-backdrop" aria-hidden="true"></div>
      <img class="lightbox-image" alt="" />
      <button class="lightbox-close" type="button" aria-label="Close enlarged image" autofocus>
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </dialog>
  `;
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

  document.querySelectorAll(".pub-image-wrapper").forEach((button) => {
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
  bindImageLightbox();
  bindActiveNav();
};

init();
