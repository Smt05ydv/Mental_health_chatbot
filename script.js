 // ---------- SCREEN SWITCHING ----------
  const buttons = document.querySelectorAll(".nav-btn");
  const screens = document.querySelectorAll(".screen");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-screen");

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      screens.forEach((screen) => {
        if (screen.id === "screen-" + target) {
          screen.classList.add("active");
        } else {
          screen.classList.remove("active");
        }
      });
    });
  });

  // ---------- CHAT INTERACTION ----------
  const messagesContainer = document.querySelector(".messages");
  const chatInput = document.querySelector(".chat-input-box input");
  const sendBtn = document.querySelector(".send-btn");
  let currentMood = "Stressed";

  function createMessageElement(role, text) {
    const msg = document.createElement("div");
    msg.classList.add("msg", role);
    const bubble = document.createElement("div");
    bubble.classList.add("msg-bubble");
    bubble.textContent = text;

    if (role === "bot") {
      const avatar = document.createElement("div");
      avatar.classList.add("msg-avatar");
      avatar.textContent = "AI";
      msg.appendChild(avatar);
      msg.appendChild(bubble);
    } else if (role === "user") {
      msg.appendChild(bubble);
    } else if (role === "meta") {
      const span = document.createElement("span");
      span.innerHTML = text;
      msg.classList.add("meta");
      msg.innerHTML = "";
      msg.appendChild(span);
      return msg;
    }

    return msg;
  }

  function scrollMessagesToBottom() {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function generateBotReply(message, mood) {
    const msg = message.toLowerCase();

    if (msg.includes("exam") || msg.includes("test")) {
      return (
        "Exams are stressing you. Let's chunk this: pick ONE subject and set a 25-minute focused block. " +
        "After that, we look at the next step instead of the entire future."
      );
    }

    if (msg.includes("sleep") || msg.includes("tired")) {
      return (
        "Your body is clearly asking for rest. Try a fixed 'phone off' time and a simple wind-down routine. " +
        "We can design that routine together if you want."
      );
    }

    if (mood === "Stressed") {
      return (
        "You marked yourself as stressed. Name ONE concrete thing adding to that stress right now. " +
        "We’ll attack that, not the whole universe."
      );
    }

    if (mood === "Low") {
      return (
        "When mood is low, energy is limited. Instead of big goals, let’s choose the smallest possible action " +
        "that still moves you slightly forward."
      );
    }

    if (mood === "Tired") {
      return (
        "If you’re tired, pushing harder might not be the answer. Sometimes the best productivity hack is a proper break."
      );
    }

    return (
      "Thanks for sharing that. I’m here to help you untangle it. Tell me: do you want to vent, " +
      "or do you want a step-by-step plan?"
    );
  }

  function sendMessage() {
    if (!chatInput || !messagesContainer) return;
    const text = chatInput.value.trim();
    if (!text) return;

    // user message
    const userMsg = createMessageElement("user", text);
    messagesContainer.appendChild(userMsg);

    // meta mood tag
    const metaMsg = createMessageElement(
      "meta",
      `Mood right now: <strong>${currentMood}</strong>`
    );
    messagesContainer.appendChild(metaMsg);

    scrollMessagesToBottom();
    chatInput.value = "";

    // bot reply after a short delay
    const moodSnapshot = currentMood;
    setTimeout(() => {
      const reply = generateBotReply(text, moodSnapshot);
      const botMsg = createMessageElement("bot", reply);
      messagesContainer.appendChild(botMsg);
      scrollMessagesToBottom();
    }, 700);
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // ---------- MOOD SELECTOR ----------
  const moodChips = document.querySelectorAll(".mood-chip");
  moodChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      moodChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      // text after emoji
      const parts = chip.textContent.trim().split(" ");
      currentMood = parts.slice(1).join(" ") || parts[0];
      // small meta message
      if (messagesContainer) {
        const meta = createMessageElement(
          "meta",
          `Mood changed to <strong>${currentMood}</strong>`
        );
        messagesContainer.appendChild(meta);
        scrollMessagesToBottom();
      }
    });
  });

  // ---------- SCALE PILL TOGGLE (SELF-ASSESSMENT) ----------
  const scalePills = document.querySelectorAll(".scale-pill");
  scalePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const parent = pill.parentElement;
      if (!parent) return;
      parent.querySelectorAll(".scale-pill").forEach((p) => {
        p.classList.remove("active");
      });
      pill.classList.add("active");
    });
  });

  // ---------- NOTES AUTOSAVE ----------
  const notesMain = document.querySelector(
    "#screen-notes .notes-area textarea"
  );
  const notesMainStatus = document.querySelector(
    "#screen-notes .notes-footer span"
  );
  const notesMainSaveBtn = document.querySelector(
    "#screen-notes .notes-footer button"
  );

  // mini note on right side
  const miniNote = document.querySelector(
    ".right-stack .panel:nth-child(2) .notes-area textarea"
  );
  const miniNoteSendBtn = document.querySelector(
    ".right-stack .panel:nth-child(2) .notes-footer button"
  );

  // load saved notes
  if (notesMain) {
    const saved = localStorage.getItem("calmMind_notes_main");
    if (saved !== null) {
      notesMain.value = saved;
    }
    notesMain.addEventListener("input", () => {
      localStorage.setItem("calmMind_notes_main", notesMain.value);
      if (notesMainStatus) {
        notesMainStatus.textContent = "Last edited · just now (autosaved)";
      }
    });
  }

  if (miniNote) {
    const savedMini = localStorage.getItem("calmMind_notes_mini");
    if (savedMini !== null) {
      miniNote.value = savedMini;
    }
    miniNote.addEventListener("input", () => {
      localStorage.setItem("calmMind_notes_mini", miniNote.value);
    });
  }

  if (notesMainSaveBtn) {
    notesMainSaveBtn.addEventListener("click", () => {
      alert("Note saved (locally) ✅");
    });
  }

  if (miniNoteSendBtn && miniNote) {
    miniNoteSendBtn.addEventListener("click", () => {
      const text = miniNote.value.trim();
      if (!text || !messagesContainer) return;
      const msg = createMessageElement("user", text);
      messagesContainer.appendChild(msg);
      scrollMessagesToBottom();
    });
  }

  // ---------- SELF-ASSESSMENT SAVE ----------
  const checkinSaveBtn = document.querySelector(
    "#screen-assessment .assessment-footer button"
  );
  const assessmentSummarySpan =
    document.querySelectorAll(".assessment-footer span")[1];

  function getActiveText(selector) {
    const el = document.querySelector(selector + " .scale-pill.active");
    if (!el) return null;
    return el.textContent.trim();
  }

  if (checkinSaveBtn) {
    checkinSaveBtn.addEventListener("click", () => {
      const mood = getActiveText(
        "#screen-assessment .field:nth-of-type(1)"
      );
      const anxiety = getActiveText(
        "#screen-assessment .field:nth-of-type(2)"
      );
      const sleep = getActiveText(
        "#screen-assessment .field:nth-of-type(3)"
      );

      if (assessmentSummarySpan) {
        assessmentSummarySpan.textContent = `Last self-assessment: Today · Mood = ${
          mood || "N/A"
        }, Anxiety = ${anxiety || "N/A"}, Sleep = ${sleep || "N/A"}`;
      }

      alert("Check-in saved ✅");
    });
  }

  // ---------- BREATHING TEXT LOOP ----------
  const breathCircle = document.querySelector("#screen-breathing .breath-circle");

  if (breathCircle) {
    const sequence = [
      { label: "Inhale", duration: 4000 },
      { label: "Hold", duration: 7000 },
      { label: "Exhale", duration: 8000 },
    ];

    let index = 0;
    function runBreathCycle() {
      const step = sequence[index];
      breathCircle.textContent = step.label;
      setTimeout(() => {
        index = (index + 1) % sequence.length;
        runBreathCycle();
      }, step.duration);
    }
    runBreathCycle();
  }

  // ---------- CRISIS BUTTON DEMO ----------
  const crisisBtn = document.querySelector(".support-card button");
  if (crisisBtn) {
    crisisBtn.addEventListener("click", () => {
      alert(
        "This is a demo.\n\nIf you are in immediate danger, contact your local emergency number or a trusted adult right now."
      );
    });
  }

  // ---------- DARK MODE TOGGLE (simple interaction) ----------
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("change", (event) => {
      const enabled = event.target.checked;
      // Just a subtle body background tweak so user sees something happening
      document.body.style.transition = "background 0.3s ease";
      if (enabled) {
        document.body.style.background =
          "radial-gradient(circle at top, #1f2937, #020617 55%)";
      } else {
        document.body.style.background =
          "radial-gradient(circle at top, #020617, #020617 55%)";
      }
    });
  }

  // ---------- GOOGLE BUTTON DEMO ----------
  const googleBtn = document.querySelector(".google-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      alert("Fake Google login for project demo 😄");
    });
  }