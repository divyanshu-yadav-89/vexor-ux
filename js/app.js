/**
 * VexorUX — Interactive UI Engine
 * Controls: Toast, Scrollspy, Scope Calculator, Ctrl+K Command Palette, Modals & Forms
 */

// 1. Toast Notification Helper
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
let toastTimer = null;

function showToast(msg) {
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add("active");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("active");
  }, 3000);
}

function copyText(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || "Copied to clipboard!");
  }).catch(() => {
    showToast("Copied: " + text);
  });
}

// 2. Scroll Progress & Scrollspy Navigation
const scrollProgress = document.getElementById("scrollProgress");
const navbar = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (scrollProgress && height > 0) {
    scrollProgress.style.width = (winScroll / height) * 100 + "%";
  }

  if (navbar) {
    navbar.classList.toggle("scrolled", winScroll > 20);
  }

  let currentSection = "";
  sections.forEach(section => {
    if (winScroll >= section.offsetTop - 120) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}, { passive: true });

// Mobile Navigation Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => navMenu.classList.toggle("mobile-open"));
  navLinks.forEach(link => link.addEventListener("click", () => navMenu.classList.remove("mobile-open")));
}

// 3. Reveal-On-Scroll Animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// 4. Mouse Spotlight Hover Effect for Bento Cards
document.querySelectorAll(".spotlight-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  });
});

// 5. Interactive Scope & Cost Estimator
const calcItems = document.querySelectorAll(".calc-item");
const estPrice = document.getElementById("estPrice");
const estTime = document.getElementById("estTime");
const btnExportWhatsApp = document.getElementById("btnExportWhatsApp");
const btnCopyScope = document.getElementById("btnCopyScope");

function updateEstimator() {
  let totalPrice = 0;
  let totalDays = 0;
  const selectedNames = [];

  calcItems.forEach(item => {
    if (item.classList.contains("checked")) {
      totalPrice += parseInt(item.dataset.price, 10);
      totalDays += parseInt(item.dataset.days, 10);
      selectedNames.push(item.dataset.name);
    }
  });

  if (estPrice && estTime) {
    if (totalPrice === 0) {
      estPrice.textContent = "₹0";
      estTime.textContent = "⏱ Select at least 1 feature";
    } else {
      estPrice.textContent = "₹" + totalPrice.toLocaleString("en-IN");
      const weeksMin = Math.max(1, Math.round(totalDays / 7));
      estTime.textContent = `⏱ ~${weeksMin} to ${weeksMin + 1} Weeks Delivery`;
    }
  }

  if (btnExportWhatsApp) {
    const waMsg = encodeURIComponent(
      `Hi Divyanshu! I configured a project estimate on VexorUX:\n\n` +
      `• Selected Deliverables: ${selectedNames.join(", ") || "None"}\n` +
      `• Estimated Scope: ₹${totalPrice.toLocaleString("en-IN")}\n` +
      `• Timeline: ~${Math.max(1, Math.round(totalDays / 7))} to ${Math.max(1, Math.round(totalDays / 7)) + 1} Weeks\n\n` +
      `I'd like to discuss bringing this to production!`
    );
    btnExportWhatsApp.onclick = () => window.open(`https://wa.me/917222977455?text=${waMsg}`, "_blank");
  }

  if (btnCopyScope) {
    btnCopyScope.onclick = () => {
      const text = `VexorUX Scope Estimate:\nItems: ${selectedNames.join(", ")}\nTotal: ₹${totalPrice.toLocaleString("en-IN")}\nTarget: ~${Math.max(1, Math.round(totalDays / 7))} to ${Math.max(1, Math.round(totalDays / 7)) + 1} Weeks`;
      copyText(text, "Project scope copied to clipboard!");
    };
  }
}

calcItems.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("checked");
    updateEstimator();
  });
});
updateEstimator();

// 6. Command Palette (Ctrl+K / Cmd+K)
const cmdPalette = document.getElementById("cmdPalette");
const cmdInput = document.getElementById("cmdInput");
const cmdList = document.getElementById("cmdList");

function openCmdPalette() {
  if (!cmdPalette || !cmdInput) return;
  cmdPalette.classList.add("open");
  document.body.style.overflow = "hidden";
  cmdInput.value = "";
  filterCmdList("");
  setTimeout(() => cmdInput.focus(), 80);
}

function closeCmdPalette() {
  if (!cmdPalette) return;
  cmdPalette.classList.remove("open");
  document.body.style.overflow = "";
}

function navigateSection(selector) {
  closeCmdPalette();
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function filterCmdList(query) {
  if (!cmdList) return;
  const q = query.toLowerCase().trim();
  cmdList.querySelectorAll(".cmd-item").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(q) ? "flex" : "none";
  });
}

if (cmdInput) {
  cmdInput.addEventListener("input", (e) => filterCmdList(e.target.value));
}

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (cmdPalette) {
      cmdPalette.classList.contains("open") ? closeCmdPalette() : openCmdPalette();
    }
  }
  if (e.key === "Escape") {
    if (cmdPalette && cmdPalette.classList.contains("open")) closeCmdPalette();
    if (modalBackdrop && modalBackdrop.classList.contains("open")) closeBookingModal();
  }
});

if (cmdPalette) {
  cmdPalette.addEventListener("click", (e) => {
    if (e.target === cmdPalette) closeCmdPalette();
  });
}

// 7. Booking Modal Controller
const modalBackdrop = document.getElementById("bookingModal");

function openBookingModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
  const nameInput = document.getElementById("mName");
  if (nameInput) setTimeout(() => nameInput.focus(), 100);
}

function closeBookingModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove("open");
  document.body.style.overflow = "";
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeBookingModal();
  });
}

// 8. Unified Form Handling (Direct & Modal)
function setupForm(formId, statusId) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.innerHTML : "Submit";
    if (submitBtn) {
      submitBtn.innerHTML = "Processing Brief...";
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      if (status) status.classList.add("active");
      if (submitBtn) submitBtn.innerHTML = "Brief Ready ✓";
      showToast("Project request captured successfully!");
      form.reset();
      
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
        }
      }, 3500);
    }, 600);
  });
}

setupForm("directContactForm", "contactStatus");
setupForm("modalBookingForm", "modalStatus");
