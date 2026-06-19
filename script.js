const registrationUrl = document.body.dataset.registrationUrl?.trim();

if (registrationUrl) {
  document.querySelectorAll('a[href^="https://rzp.io"], a[href="#registration"]').forEach((link) => {
    link.setAttribute("href", registrationUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
    link.addEventListener("click", () => {
      const section = link.closest("section");
      const location = section?.id || section?.className?.split(" ")[0] || "site";

      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout", {
          content_name: "Business Skool ₹99 Webinar",
          content_category: "Webinar",
          value: 99,
          currency: "INR"
        });
        window.fbq("trackCustom", "Webinar99ButtonClick", {button_location: location});
      }
    });
  });
}

document.querySelectorAll(".video-launch").forEach((button) => {
  button.addEventListener("click", () => {
    const videoId = button.dataset.videoId;
    const videoLabel = button.dataset.videoLabel || "Business Skool testimonial";
    const videoEvent = button.dataset.videoEvent || "TestimonialVideoPlay";

    if (!videoId) return;

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", videoEvent, {
        video_id: videoId,
        video_name: videoLabel
      });
    }

    if (window.location.protocol === "file:") {
      const notice = document.createElement("span");
      notice.className = "local-video-notice";
      notice.innerHTML = "<strong>Video is ready for the live website.</strong><span>YouTube blocks players opened directly as a local file. Open this page through localhost or your live domain to play it here without leaving the page.</span>";
      button.replaceChildren(notice);
      button.classList.add("is-local-preview");
      return;
    }

    const iframe = document.createElement("iframe");
    const liveOrigin = window.location.protocol === "http:" || window.location.protocol === "https:"
      ? window.location.origin
      : "https://lead.businessschool.in";
    const playerParams = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      origin: liveOrigin,
      widget_referrer: `${liveOrigin}/`
    });
    iframe.src = `https://www.youtube.com/embed/${videoId}?${playerParams.toString()}`;
    iframe.title = videoLabel;
    iframe.loading = "eager";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    button.replaceChildren(iframe);
    button.classList.add("is-playing");
    button.closest(".video-embed")?.classList.add("is-playing");
  }, {once: true});
});

const assessmentRanges = document.querySelectorAll(".assessment-range");
const assessmentScore = document.querySelector("#assessment-score");
const assessmentMessage = document.querySelector("#assessment-message");

if (assessmentRanges.length && assessmentScore && assessmentMessage) {
  const updateAssessment = () => {
    let total = 0;

    assessmentRanges.forEach((range) => {
      const value = Number(range.value);
      total += value;
      const output = range.parentElement?.querySelector("output");
      if (output) output.value = String(value);
    });

    assessmentScore.textContent = `${total}/25`;

    if (total <= 10) {
      assessmentMessage.textContent = "Low dependency. Use the webinar to make your systems even stronger.";
    } else if (total <= 20) {
      assessmentMessage.textContent = "Your business needs stronger ownership, systems and follow-through.";
    } else {
      assessmentMessage.textContent = "High owner dependency. This webinar will help you choose what to fix first.";
    }
  };

  assessmentRanges.forEach((range) => range.addEventListener("input", updateAssessment));
  updateAssessment();
}

const galleryButtons = [...document.querySelectorAll(".glimpse-card")];
const galleryDialog = document.querySelector(".glimpse-lightbox");

if (galleryButtons.length && galleryDialog) {
  const galleryImage = galleryDialog.querySelector("img");
  const galleryCount = galleryDialog.querySelector("p");
  const galleryClose = galleryDialog.querySelector(".glimpse-close");
  const galleryPrev = galleryDialog.querySelector(".glimpse-prev");
  const galleryNext = galleryDialog.querySelector(".glimpse-next");
  let activeGalleryIndex = 0;

  const showGalleryImage = (index) => {
    activeGalleryIndex = (index + galleryButtons.length) % galleryButtons.length;
    const sourceImage = galleryButtons[activeGalleryIndex].querySelector("img");

    if (galleryImage && sourceImage) {
      galleryImage.src = sourceImage.src;
      galleryImage.alt = sourceImage.alt;
    }

    if (galleryCount) galleryCount.textContent = `${activeGalleryIndex + 1} of ${galleryButtons.length}`;
  };

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showGalleryImage(index);
      if (typeof galleryDialog.showModal === "function") galleryDialog.showModal();
      else galleryDialog.setAttribute("open", "");

      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "WebinarGalleryOpen", {image_number: index + 1});
      }
    });
  });

  galleryClose?.addEventListener("click", () => galleryDialog.close());
  galleryPrev?.addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
  galleryNext?.addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}
