/* V26: privacy-aware project brief and guided project assistant. */
(() => {
  const modal = document.getElementById("projectBriefModal");
  const form = document.getElementById("projectBriefForm");
  const steps = [...document.querySelectorAll("[data-brief-step]")];
  const openButtons = [...document.querySelectorAll(".js-open-project-brief")];
  const closeButtons = [...document.querySelectorAll("[data-close-project-brief]")];
  const backButton = document.getElementById("briefBackButton");
  const nextButton = document.getElementById("briefNextButton");
  const stepLabel = document.getElementById("briefStepLabel");
  const progressBar = document.getElementById("briefProgressBar");
  const recommendationNode = document.getElementById("briefRecommendation");
  const firstMoveNode = document.getElementById("briefFirstMove");
  const summaryNode = document.getElementById("briefSummary");
  const emailButton = document.getElementById("briefEmailButton");
  const copyButton = document.getElementById("briefCopyButton");
  const briefStatus = document.getElementById("briefStatus");
  const saveDraftCheckbox = document.getElementById("briefSaveDraft");
  const restoreButton = document.getElementById("briefRestoreButton");
  const clearButton = document.getElementById("briefClearButton");

  const launcher = document.getElementById("assistantLauncher");
  const assistant = document.getElementById("projectAssistant");
  const assistantClose = document.getElementById("assistantClose");
  const assistantMessages = document.getElementById("assistantMessages");
  const assistantActions = document.getElementById("assistantActions");
  const assistantForm = document.getElementById("assistantForm");
  const assistantQuestion = document.getElementById("assistantQuestion");

  if (!modal || !form || !steps.length) return;

  const config = window.RONS_WORK_CONFIG || {};
  const contactEmail = config.contactEmail || "ronjr.dialino@gmail.com";
  const intakeEndpoint = String(config.intakeEndpoint || "").trim();
  const storageKey = "ronsWorkProjectBriefV26";
  const draftFields = new Set([
    "service", "problem", "outcome", "tools", "volume", "timeline", "scope", "company"
  ]);
  let currentStep = 1;
  let lastFocusedElement = null;

  const serviceProfiles = {
    healthcare: {
      label: "Healthcare administration and claims support",
      recommendation: "A controlled healthcare admin workflow with clear document status, ownership and reporting.",
      firstMove: "Map the claim or document lifecycle, then establish one source of truth for status and follow-up."
    },
    records: {
      label: "Records and document control",
      recommendation: "A consistent document-control system built around naming, filing, tracking and review.",
      firstMove: "Audit the current folder structure and create a practical file-naming and status standard."
    },
    reporting: {
      label: "Reports and data support",
      recommendation: "A repeatable reporting workflow with validated inputs, clear calculations and dependable delivery.",
      firstMove: "Identify the decisions the report must support before rebuilding the tracker or dashboard."
    },
    automation: {
      label: "Workflow automation",
      recommendation: "A simplified operating workflow that removes repetitive handoffs and makes ownership visible.",
      firstMove: "Document the trigger, decision points and final output before selecting the automation method."
    },
    web: {
      label: "Web or visual support",
      recommendation: "A responsive digital experience with clear hierarchy, focused content and practical interaction.",
      firstMove: "Define the primary audience action, then structure the content around that conversion path."
    },
    other: {
      label: "Custom operations support",
      recommendation: "A scoped support plan based on the clearest operational outcome and highest-friction task.",
      firstMove: "Clarify the current process, desired result and evidence that the new solution is working."
    }
  };

  function getFormData() {
    return Object.fromEntries(new FormData(form).entries());
  }

  function getDraftData() {
    const data = getFormData();
    return Object.fromEntries(
      Object.entries(data).filter(([name]) => draftFields.has(name))
    );
  }

  function saveDraft() {
    if (!saveDraftCheckbox?.checked) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(getDraftData()));
      briefStatus.textContent = "Draft saved in this browser. Contact details and the safety confirmation are not stored.";
    } catch (error) {
      briefStatus.textContent = "Local draft saving is unavailable in this browser.";
    }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        briefStatus.textContent = "No saved draft was found in this browser.";
        return;
      }

      const saved = JSON.parse(raw);
      Object.entries(saved).forEach(([name, value]) => {
        if (!draftFields.has(name)) return;
        const fields = [...form.elements].filter(field => field.name === name);
        fields.forEach(field => {
          if (field.type === "radio") {
            field.checked = field.value === value;
          } else {
            field.value = value;
          }
        });
      });

      if (saveDraftCheckbox) saveDraftCheckbox.checked = true;
      briefStatus.textContent = "Saved project details restored. Re-enter contact details and confirm the safety notice.";
      buildBrief();
    } catch (error) {
      briefStatus.textContent = "The saved draft could not be restored.";
    }
  }

  function clearDraft(options = {}) {
    try {
      localStorage.removeItem(storageKey);
      if (saveDraftCheckbox) saveDraftCheckbox.checked = false;
      if (!options.silent) {
        briefStatus.textContent = "Saved draft cleared from this browser.";
      }
    } catch (error) {
      if (!options.silent) {
        briefStatus.textContent = "The saved draft could not be cleared.";
      }
    }
  }

  function validateCurrentStep() {
    const activeStep = steps[currentStep - 1];
    const requiredFields = [...activeStep.querySelectorAll("[required]")];

    for (const field of requiredFields) {
      if (field.type === "radio") {
        const checked = activeStep.querySelector(`[name="${field.name}"]:checked`);
        if (!checked) {
          field.setAttribute("aria-invalid", "true");
          field.closest(".brief-choice")?.focus?.();
          const firstRadio = activeStep.querySelector(`[name="${field.name}"]`);
          firstRadio?.focus();
          return false;
        }
      } else if (!field.checkValidity()) {
        field.setAttribute("aria-invalid", "true");
        field.reportValidity();
        return false;
      }
    }

    requiredFields.forEach(field => field.removeAttribute("aria-invalid"));
    return true;
  }

  function buildBrief() {
    const data = getFormData();
    const profile = serviceProfiles[data.service] || serviceProfiles.other;
    const companyLine = data.company ? `Company / team: ${data.company}\n` : "";

    recommendationNode.textContent = profile.recommendation;
    firstMoveNode.textContent = profile.firstMove;

    summaryNode.value =
`RON'S WORK — PROJECT BRIEF

Client: ${data.clientName || "Not provided"}
Email: ${data.clientEmail || "Not provided"}
${companyLine}Support needed: ${profile.label}
Preferred timeline: ${data.timeline || "Not provided"}
Engagement type: ${data.scope || "Not provided"}

CURRENT GAP
${data.problem || "Not provided"}

DESIRED OUTCOME
${data.outcome || "Not provided"}

CURRENT TOOLS
${data.tools || "Not provided"}

APPROXIMATE VOLUME
${data.volume || "Not provided"}

RECOMMENDED DIRECTION
${profile.recommendation}

SUGGESTED FIRST MOVE
${profile.firstMove}`;

    saveDraft();
  }

  function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep - 1);
    });

    stepLabel.textContent = `${String(currentStep).padStart(2, "0")} / 04`;
    progressBar.style.transform = `scaleX(${currentStep / 4})`;
    backButton.style.visibility = currentStep === 1 ? "hidden" : "visible";
    nextButton.style.display = currentStep === 4 ? "none" : "inline-flex";

    if (currentStep === 4) buildBrief();

    const activeHeading = steps[currentStep - 1].querySelector("h3");
    activeHeading?.focus?.({ preventScroll: true });
  }

  function openBrief(preselectedService = "") {
    lastFocusedElement = document.activeElement;

    if (preselectedService && serviceProfiles[preselectedService]) {
      const radio = form.querySelector(`[name="service"][value="${preselectedService}"]`);
      if (radio) radio.checked = true;
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("automation-open");
    currentStep = 1;
    updateStep();

    requestAnimationFrame(() => {
      modal.querySelector(".sharp-close")?.focus();
    });
  }

  function closeBrief() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("automation-open");
    lastFocusedElement?.focus?.();
  }

  openButtons.forEach(button => button.addEventListener("click", () => {
    const source = button.closest("header") ? "header" : "contact";
    form.dataset.openedFrom = source;
    openBrief();
  }));
  closeButtons.forEach(button => button.addEventListener("click", closeBrief));

  form.addEventListener("input", () => {
    if (saveDraftCheckbox?.checked) saveDraft();
  });
  form.addEventListener("change", () => {
    if (saveDraftCheckbox?.checked) saveDraft();
  });

  nextButton.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    currentStep = Math.min(4, currentStep + 1);
    updateStep();
  });

  backButton.addEventListener("click", () => {
    currentStep = Math.max(1, currentStep - 1);
    updateStep();
  });

  emailButton.textContent = intakeEndpoint ? "Send inquiry" : "Compose email";

  emailButton.addEventListener("click", async () => {
    buildBrief();
    const data = getFormData();
    const profile = serviceProfiles[data.service] || serviceProfiles.other;
    const subject = `Project inquiry — ${profile.label}`;

    if (intakeEndpoint) {
      emailButton.disabled = true;
      emailButton.textContent = "Sending…";
      briefStatus.textContent = "Sending the project brief securely…";

      try {
        const response = await fetch(intakeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            submittedAt: new Date().toISOString(),
            source: window.location.href,
            openedFrom: form.dataset.openedFrom || "assistant",
            data,
            summary: summaryNode.value
          })
        });

        if (!response.ok) throw new Error(`Submission failed: ${response.status}`);
        clearDraft({ silent: true });
        briefStatus.textContent = "Inquiry sent. Ronaldo will review the brief and reply by email.";
        emailButton.textContent = "Inquiry sent";
        return;
      } catch (error) {
        briefStatus.textContent = "Secure submission is temporarily unavailable. Opening an email draft instead.";
      } finally {
        emailButton.disabled = false;
      }
    }

    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summaryNode.value)}`;
    emailButton.textContent = "Compose email";
    window.location.href = mailto;
  });

  copyButton.addEventListener("click", async () => {
    buildBrief();
    try {
      await navigator.clipboard.writeText(summaryNode.value);
      briefStatus.textContent = "Brief copied. It is ready to paste into email, LinkedIn or Upwork.";
    } catch (error) {
      summaryNode.focus();
      summaryNode.select();
      document.execCommand("copy");
      briefStatus.textContent = "Brief selected and copied.";
    }
  });

  restoreButton?.addEventListener("click", restoreDraft);
  clearButton?.addEventListener("click", clearDraft);
  saveDraftCheckbox?.addEventListener("change", () => {
    if (saveDraftCheckbox.checked) {
      saveDraft();
    } else {
      briefStatus.textContent = "Local saving is off. Any existing saved draft remains until you clear it.";
    }
  });

  updateStep();

  function setAssistant(open) {
    assistant.classList.toggle("open", open);
    assistant.setAttribute("aria-hidden", String(!open));
    launcher.setAttribute("aria-expanded", String(open));
    if (open) setTimeout(() => assistantQuestion?.focus(), 80);
  }

  function addAssistantMessage(text, role = "bot", action = null) {
    const message = document.createElement("div");
    message.className = `assistant-message assistant-message-${role}`;

    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.appendChild(paragraph);

    if (action) {
      const actionButton = document.createElement("button");
      actionButton.className = "assistant-message-action";
      actionButton.type = "button";
      actionButton.textContent = action.label;
      actionButton.addEventListener("click", () => openBrief(action.service || ""));
      message.appendChild(actionButton);
    }

    assistantMessages.appendChild(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  }

  function assistantReply(input) {
    const text = input.toLowerCase();

    if (/(claim|billing|philhealth|hospital|healthcare|denied|rth)/.test(text)) {
      return {
        text: "Healthcare admin support is the strongest fit. The first step is usually to map document status, ownership, follow-up points and the report the team needs.",
        action: { label: "Build a healthcare brief", service: "healthcare" }
      };
    }

    if (/(record|document|folder|filing|audit|naming)/.test(text)) {
      return {
        text: "This fits records and document control. Ron can help organize naming, filing, status tracking and a practical review routine.",
        action: { label: "Build a document-control brief", service: "records" }
      };
    }

    if (/(report|excel|sheet|dashboard|data|tracker)/.test(text)) {
      return {
        text: "This fits reporting and data support. A good engagement starts by defining the decisions the report must support, then simplifying the inputs and calculations.",
        action: { label: "Build a reporting brief", service: "reporting" }
      };
    }

    if (/(automat|workflow|crm|integration|repeat|handoff|process)/.test(text)) {
      return {
        text: "This fits workflow automation. The brief will capture the trigger, current handoffs, tools involved and the final output before recommending an automation path.",
        action: { label: "Build an automation brief", service: "automation" }
      };
    }

    if (/(website|web|design|invitation|landing|visual|responsive)/.test(text)) {
      return {
        text: "This fits web or visual support. Ron can structure the content, responsive interface and interaction around the audience’s main action.",
        action: { label: "Build a web brief", service: "web" }
      };
    }

    if (/(price|pricing|rate|cost|budget|estimate)/.test(text)) {
      return {
        text: "Pricing depends on the deliverable, volume, timeline and whether support is one-time or recurring. The automated brief collects those details so Ron can review the scope accurately.",
        action: { label: "Create a scope for review" }
      };
    }

    if (/(available|availability|start|timeline|when)/.test(text)) {
      return {
        text: "Availability is confirmed after a brief review. Sharing the preferred timeline and engagement type makes it easier to propose a realistic start and first milestone.",
        action: { label: "Share timeline and scope" }
      };
    }

    if (/(sample|portfolio|work|project)/.test(text)) {
      return {
        text: "The Selected Work and Visual Archive sections show responsive websites, reporting interfaces, documentation and visual design. A brief can also point Ron to the most relevant sample.",
        action: { label: "Match my project to a sample" }
      };
    }

    if (/(tool|software|platform|technology)/.test(text)) {
      return {
        text: "The toolkit covers Microsoft and Google systems, reporting, CRM operations, creative tools, AI support and web development. Tool choice follows the workflow rather than forcing a new platform.",
        action: { label: "Describe my current tools" }
      };
    }

    if (/(process|how do we work|next step)/.test(text)) {
      return {
        text: "The working process is: collect the brief, review the current workflow, confirm the first deliverable, then begin with a clear milestone and update rhythm.",
        action: { label: "Start the project brief" }
      };
    }

    if (/(hello|hi|hey)/.test(text)) {
      return {
        text: "Hello. Tell me what is currently slow, scattered or difficult to track, and I’ll point you toward the most relevant support."
      };
    }

    return {
      text: "I can help narrow that down. Describe the current problem, the result you need, and any tools already involved—or start the guided brief.",
      action: { label: "Start guided brief" }
    };
  }

  launcher?.addEventListener("click", () => {
    setAssistant(!assistant.classList.contains("open"));
  });

  assistantClose?.addEventListener("click", () => setAssistant(false));

  assistantActions?.addEventListener("click", event => {
    const button = event.target.closest("[data-assistant-action]");
    if (!button) return;

    const action = button.dataset.assistantAction;
    const responses = {
      services: "Ron’s Work supports healthcare administration, records and document control, reporting, workflow automation, and responsive web or visual projects.",
      process: "The process is brief → workflow review → proposed first deliverable → clear milestone and update rhythm.",
      availability: "Availability is reviewed against your preferred timeline and scope. The project brief is the fastest way to provide the needed details."
    };

    if (action === "brief") {
      setAssistant(false);
      openBrief();
      return;
    }

    addAssistantMessage(responses[action] || "Tell me what you need help with.");
  });

  assistantForm?.addEventListener("submit", event => {
    event.preventDefault();
    const question = assistantQuestion.value.trim();
    if (!question) return;

    addAssistantMessage(question, "user");
    assistantQuestion.value = "";

    const reply = assistantReply(question);
    setTimeout(() => addAssistantMessage(reply.text, "bot", reply.action), 220);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (modal.classList.contains("open")) {
        closeBrief();
        return;
      }

      if (assistant.classList.contains("open")) {
        setAssistant(false);
        launcher?.focus();
      }
      return;
    }

    if (event.key === "Tab" && modal.classList.contains("open")) {
      const focusable = [...modal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
      )].filter(element => element.offsetParent !== null);

      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
