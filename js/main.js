(() => {
  /* page transition overlay */
  const transition = document.createElement("div");
  transition.className = "page-transition";
  document.body.appendChild(transition);

  /* play enter animation on load */
  requestAnimationFrame(() => transition.classList.add("enter"));

  /* intercept all internal links for exit transition */
  let transitioning = false;
  document.addEventListener("click", (e) => {
    if (transitioning) return;
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http") || a.target === "_blank") return;
    e.preventDefault();
    transitioning = true;
    document.body.classList.add("loading");
    transition.classList.remove("enter");
    transition.classList.add("exit");
    setTimeout(() => { window.location.href = href; }, 350);
  });

  /* custom cursor */
  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mousedown", () => cursor.classList.add("click"));
    document.addEventListener("mouseup", () => cursor.classList.remove("click"));

    function bindHover() {
      document.querySelectorAll("a, button, .tags span, .project-card").forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
      });
    }
    bindHover();
  }

  /* scroll reveal */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  /* 88x31 buttons */
  const buttonsOpen = document.getElementById("buttons-open");
  const buttonsOverlay = document.getElementById("buttons-overlay");
  const buttonsClose = document.getElementById("buttons-close");
  const buttonsGrid = document.getElementById("buttons-grid");

  const buttons = [
    { href: "https://duckers.dev", alt: "me :)", img: "https://duckers.dev/button.gif" },
    { href: "https://gideon.sh", alt: "this site is actually pretty cool", img: "https://gideon.sh/88x31.gif" },
    
  ];

  buttons.forEach((b) => {
    const a = document.createElement("a");
    a.href = b.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = b.alt;
    if (b.img) {
      const img = document.createElement("img");
      img.src = b.img;
      img.alt = b.alt;
      a.appendChild(img);
    } else {
      a.className = "buttons-text";
      a.textContent = b.text;
    }
    buttonsGrid.appendChild(a);
  });

  if (buttonsOpen && buttonsOverlay) {
    buttonsOpen.addEventListener("click", () => { buttonsOverlay.classList.add("active"); });
    buttonsClose.addEventListener("click", () => { buttonsOverlay.classList.remove("active"); });
    buttonsOverlay.addEventListener("click", (e) => { if (e.target === buttonsOverlay) buttonsOverlay.classList.remove("active"); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") buttonsOverlay.classList.remove("active"); });
  }

  const buttonsCopyBtn = document.getElementById("buttons-copy");
  const buttonsCode = document.getElementById("buttons-code");
  if (buttonsCopyBtn && buttonsCode) {
    buttonsCopyBtn.addEventListener("click", async () => {
      buttonsCode.select();
      try {
        await navigator.clipboard.writeText(buttonsCode.value);
      } catch {
        document.execCommand("copy");
      }
      buttonsCopyBtn.textContent = "copied";
      setTimeout(() => { buttonsCopyBtn.textContent = "copy"; }, 1500);
    });
  }

  /* contact form */
  const form = document.querySelector(".contact-form");
  if (form) {
    const status = document.getElementById("form-status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (status) status.textContent = "sending...";
      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form) });
        const json = await res.json();
        if (json.success) {
          if (status) status.textContent = "sent. quack.";
          form.reset();
        } else {
          if (status) status.textContent = "failed. try again.";
        }
      } catch {
        if (status) status.textContent = "error. try again.";
      }
    });
  }
})();