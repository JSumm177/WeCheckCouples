/**
 * WeCheck - Calming Couples Check-In Application
 * Modern, accessible client-side code supporting draft persistence,
 * dynamic charting, custom interactive forms, and therapeutic animations.
 */

// ==========================================================================
// 1. Core State Definition & Initializer
// ==========================================================================

const state = {
  mode: 'together',       // together | sidebyside | carter | jurrand
  currentStep: 1,         // 1 to 5
  draft: {},              // In-progress form inputs
  history: [],            // List of completed check-ins
  activeView: 'welcome'   // welcome | wizard | celebration | history
};

// Default check-in records for a rich, instantly satisfying first experience
const defaultHistory = [
  {
    id: 1745143200000,
    date: 'Apr 20, 2026',
    timestamp: 1745143200000,
    mode: 'together',
    answers: {
      c_scale: '7',
      j_scale: '8',
      c_most_connected: 'Our quiet sunday morning coffee in bed, just talking without checking our phones.',
      j_most_connected: 'When you surprised me by making dinner after my long exhausting work day.',
      c_distant: 'Mid-week logistics talk felt a bit transactional.',
      j_distant: 'Felt a bit distant when we were both working late on Wednesday evening.',
      c_more_of: 'More spontaneous hugs and physical touch during the week.',
      j_more_of: 'More deep checking-in instead of just discussing chores.',
      c_less_of: 'Less screen time when we are eating dinner.',
      j_less_of: 'Less rushing around on the weekends.',
      c_bothering: 'Nothing big, just a minor misunderstanding about the weekend plans that we already resolved.',
      j_bothering: 'None, felt good this week.',
      c_feel_loved: 'You leaving a sticky note on the mirror wishing me a good day.',
      j_feel_loved: 'You rubbing my shoulders when I was stressed.',
      c_grateful_quality: 'Your endless patience and active listening skills.',
      j_grateful_quality: 'Your playful sense of humor that makes me laugh even when stressed.',
      c_appreciate_relationship: 'How we always find our way back to alignment, even after hard conversations.',
      j_appreciate_relationship: 'Our shared growth and willingness to work through obstacles together.',
      c_goals_page: true,
      c_goals_notes: 'Yes, looking forward to planning our summer trip!',
      j_goals_page: true,
      j_goals_notes: 'Totally, feeling aligned on our financial planning target.',
      c_future_worries: 'A bit anxious about my job transition, but feel supported by you.',
      j_future_worries: 'No worries, feeling optimistic.',
      c_excited: 'Taking that hiking trip next month.',
      j_excited: 'Decorating the cozy corner of our living room.',
      c_couple_status: 'Flowing Steady',
      c_couple_overview_notes: 'Doing really well. Just need to manage our work stress.',
      j_couple_status: 'Flowing Steady',
      j_couple_overview_notes: 'Strong, solid, and incredibly loving week.',
      c_improve: 'Protecting our dinner connection times.',
      j_improve: 'Being more present during our evening walks.',
      c_working_well: 'Communication has been super open and kind.',
      j_working_well: 'Showing appreciation daily.'
    }
  },
  {
    id: 1745748000000,
    date: 'Apr 27, 2026',
    timestamp: 1745748000000,
    mode: 'together',
    answers: {
      c_scale: '8',
      j_scale: '7',
      c_most_connected: 'Cooking that pasta dish together on Friday night with jazz playing in the background.',
      j_most_connected: 'Our long, honest talk on the walk Saturday evening.',
      c_distant: 'When I was stressed on Tuesday and became a bit quiet and withdrawn.',
      j_distant: 'Felt a little disconnected when you were occupied with work stuff on Tuesday.',
      c_more_of: 'More little check-in texts during the day.',
      j_more_of: 'More shared laughs and lighthearted moments.',
      c_less_of: 'Less talking about work stressors late at night.',
      j_less_of: 'Less overthinking small details.',
      c_bothering: 'None at all.',
      j_bothering: 'Was slightly hurt by a sarcastic comment on Wednesday, but we cleared it up.',
      c_feel_loved: 'You planning our Friday date night fully.',
      j_feel_loved: 'You bringing me tea while I was reading on the couch.',
      c_grateful_quality: 'Your grounding presence. You calm my mind.',
      j_grateful_quality: 'Your enthusiasm and creative spark.',
      c_appreciate_relationship: 'Our emotional safety. I can tell you absolutely anything.',
      j_appreciate_relationship: 'Our friendship. You are truly my best friend.',
      c_goals_page: true,
      c_goals_notes: 'Fully aligned!',
      j_goals_page: true,
      j_goals_notes: 'Yes, looking forward to the future.',
      c_future_worries: 'None.',
      j_future_worries: 'A little worried about housing logistics, but we got this.',
      c_excited: 'Our upcoming weekend cabin getaway.',
      j_excited: 'Going to the farmer\'s market this Sunday.',
      c_couple_status: 'Flowing Steady',
      c_couple_overview_notes: 'A solid, gentle week.',
      j_couple_status: 'Flowing Steady',
      j_couple_overview_notes: 'Felt very close and supportive.',
      c_improve: 'Expressing small irritations earlier before they build.',
      j_improve: 'Giving each other 10 minutes of winding-down space after work.',
      c_working_well: 'Dividing household chores has been seamless lately.',
      j_working_well: 'Our daily physical affection.'
    }
  },
  {
    id: 1746352800000,
    date: 'May 04, 2026',
    timestamp: 1746352800000,
    mode: 'together',
    answers: {
      c_scale: '9',
      j_scale: '9',
      c_most_connected: 'Our cabin getaway! No service, just walks, reading, cooking, and sleeping in. Magical.',
      j_most_connected: 'Sitting by the fireplace at the cabin, talking about everything and nothing.',
      c_distant: 'Honestly, barely felt any distance this week. It was wonderful.',
      j_distant: 'None. It was a very aligned week.',
      c_more_of: 'More adventures like this cabin trip throughout the year.',
      j_more_of: 'More undivided attention times.',
      c_less_of: 'Less structure, more going with the flow.',
      j_less_of: 'Less worrying about email lists.',
      c_bothering: 'Absolutely nothing.',
      j_bothering: 'None!',
      c_feel_loved: 'You booking the cabin massage session for me.',
      j_feel_loved: 'You carrying my heavy bags and building the perfect fire.',
      c_grateful_quality: 'Your capability to construct a cozy, peaceful sanctuary wherever we go.',
      j_grateful_quality: 'Your kindness and the warm way you look at me.',
      c_appreciate_relationship: 'Our shared appreciation for simplicity, quietness, and nature.',
      j_appreciate_relationship: 'How easily we sync up when we step away from life\'s demands.',
      c_goals_page: true,
      c_goals_notes: '100% on the same page.',
      j_goals_page: true,
      j_goals_notes: 'Absolutely perfectly aligned.',
      c_future_worries: 'None.',
      j_future_worries: 'Zero worries this week.',
      c_excited: 'Our next trip and simple gardening next week.',
      j_excited: 'Starting a small patio garden together.',
      c_couple_status: 'Deeply Aligned',
      c_couple_overview_notes: 'Incredibly strong and restorative week.',
      j_couple_status: 'Deeply Aligned',
      j_couple_overview_notes: 'One of our absolute favorite weeks.',
      c_improve: 'Remembering this feeling when work gets hectic.',
      j_improve: 'Integrating cabin stillness into our weekdays.',
      c_working_well: 'Everything feels completely fluid and harmonious.',
      j_working_well: 'Our shared values and lifestyle pacing.'
    }
  },
  {
    id: 1746957600000,
    date: 'May 11, 2026',
    timestamp: 1746957600000,
    mode: 'together',
    answers: {
      c_scale: '8',
      j_scale: '8',
      c_most_connected: 'Planting our tomato and herb garden on the patio on Sunday. Getting our hands dirty.',
      j_most_connected: 'When we sat out on the patio with tea, looking at the little green sprouts.',
      c_distant: 'Thursday when we were both stressed and irritable about grocery lists.',
      j_distant: 'Thursday evening felt slightly tense, just miscommunication on planning.',
      c_more_of: 'More deep breaths and laughing off small friction points.',
      j_more_of: 'More patience when the other person is tired.',
      c_less_of: 'Less letting exhaustion dictate our tone with each other.',
      j_less_of: 'Less quick assumptions when planning logistics.',
      c_bothering: 'None, we talked through the Thursday tension quickly.',
      j_bothering: 'Felt slightly dismissed during the grocery list talk, but we worked it out.',
      c_feel_loved: 'You bringing me fresh strawberries from the market.',
      j_feel_loved: 'You setting up the soil and planting pots so everything was ready.',
      c_grateful_quality: 'Your resilience and helpful nature.',
      j_grateful_quality: 'Your gentle touch and soft voice.',
      c_appreciate_relationship: 'Our ability to recover quickly from minor friction points.',
      j_appreciate_relationship: 'Our shared commitment to keeping our home peaceful.',
      c_goals_page: true,
      c_goals_notes: 'Yes, on the same page.',
      j_goals_page: true,
      j_goals_notes: 'Aligned.',
      c_future_worries: 'None.',
      j_future_worries: 'None.',
      c_excited: 'Seeing our garden grow over the next few weeks!',
      j_excited: 'Harvesting our first home-grown tomatoes.',
      c_couple_status: 'Flowing Steady',
      c_couple_overview_notes: 'Good, steady week with minor bumps handled beautifully.',
      j_couple_status: 'Flowing Steady',
      j_couple_overview_notes: 'Warm, cozy, and secure.',
      c_improve: 'Counting to three before responding when tired.',
      j_improve: 'Being clearer with my physical needs when exhausted.',
      c_working_well: 'Communication has been quick, honest, and healing.',
      j_working_well: 'Co-creating nice experiences at home.'
    }
  }
];

// ==========================================================================
// 2. Elements Cache
// ==========================================================================

const el = {
  // Views
  viewWelcome: document.getElementById('view-welcome'),
  viewWizard: document.getElementById('view-wizard'),
  viewCelebration: document.getElementById('view-celebration'),
  viewHistory: document.getElementById('view-history'),

  // Header and Global controls
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  navHistoryBtn: document.getElementById('nav-history-btn'),

  // Welcome Screen
  checkinMode: document.getElementById('checkin-mode'),
  startCheckinBtn: document.getElementById('start-checkin-btn'),
  resumeDraftBtn: document.getElementById('resume-draft-btn'),
  quickInsights: document.getElementById('quick-insights'),
  quickInsightsText: document.getElementById('quick-insights-text'),
  miniTrendChart: document.getElementById('mini-trend-chart'),

  // Wizard Screen Elements
  checkinForm: document.getElementById('checkin-form'),
  wizardStepTitle: document.getElementById('wizard-step-title'),
  wizardStepSubtitle: document.getElementById('wizard-step-subtitle'),
  progressIndicator: document.getElementById('progress-indicator'),
  stepDots: document.querySelectorAll('.step-dot'),
  wizardBackBtn: document.getElementById('wizard-back-btn'),
  wizardCancelBtn: document.getElementById('wizard-cancel-btn'),
  wizardNextBtn: document.getElementById('wizard-next-btn'),

  // Slider Indicators
  cScaleInput: document.getElementById('c-scale'),
  jScaleInput: document.getElementById('j-scale'),
  valCScale: document.getElementById('val-c-scale'),
  valJScale: document.getElementById('val-j-scale'),
  emojiCScale: document.getElementById('emoji-c-scale'),
  emojiJScale: document.getElementById('emoji-j-scale'),
  textCScale: document.getElementById('text-c-scale'),
  textJScale: document.getElementById('text-j-scale'),

  // Goal checkboxes
  cGoalsPage: document.getElementById('c-goals-page'),
  jGoalsPage: document.getElementById('j-goals-page'),

  // Celebration Screen Elements
  summaryPreview: document.getElementById('summary-preview-code'),
  copySummaryBtn: document.getElementById('copy-summary-btn'),
  downloadSummaryBtn: document.getElementById('download-summary-btn'),
  saveHistoryBtn: document.getElementById('save-history-btn'),
  discardDraftBtn: document.getElementById('discard-draft-btn'),

  // History / Dashboard
  backFromHistoryBtn: document.getElementById('back-from-history-btn'),
  emptyHistory: document.getElementById('empty-history'),
  historyContainer: document.getElementById('history-items-container'),
  trendSvg: document.getElementById('trend-svg'),
  chartFilterBtns: document.querySelectorAll('.chart-filters .filter-btn'),
  backupBtn: document.getElementById('backup-db-btn'),
  restoreBtn: document.getElementById('restore-db-btn'),
  dbFileInput: document.getElementById('db-file-input'),
  clearDbBtn: document.getElementById('clear-db-btn'),

  // Modal Dialog
  modal: document.getElementById('past-checkin-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalBody: document.getElementById('modal-details-content'),
  modalCloseBtn: document.getElementById('close-modal-btn'),
  modalCloseActionBtn: document.getElementById('modal-close-action-btn'),
  modalCopyBtn: document.getElementById('modal-copy-btn'),

  // Floating Sparkle emitter
  heartBurstEmitter: document.getElementById('heart-burst-emitter'),
  toastContainer: document.getElementById('toast-container')
};

// Map connected scale to emojis & descriptions
const scaleFeedback = {
  1: { emoji: '💔', text: 'Disconnected' },
  2: { emoji: '💔', text: 'Quite Distant' },
  3: { emoji: '😐', text: 'Somewhat Distant' },
  4: { emoji: '😐', text: 'Slightly Disconnected' },
  5: { emoji: '😊', text: 'Moderately Connected' },
  6: { emoji: '😊', text: 'Good Connection' },
  7: { emoji: '🌟', text: 'Warm & Connected' },
  8: { emoji: '🌟', text: 'Very Close' },
  9: { emoji: '💖', text: 'Deeply Connected!' },
  10: { emoji: '💖', text: 'Complete Oneness!' }
};

// Step configuration structures
const stepsMeta = {
  1: { title: '1. Connectedness', subtitle: 'Reflecting on how close we felt this week.' },
  2: { title: '2. Needs', subtitle: 'Honoring and expressing our individual needs.' },
  3: { title: '3. Appreciation', subtitle: 'Cultivating love and sharing gratitude.' },
  4: { title: '4. Goals & Future', subtitle: 'Staying aligned on our paths and dreams.' },
  5: { title: '5. Overview', subtitle: 'Reviewing our relationship flow and growth areas.' }
};

// ==========================================================================
// 3. Setup Navigation & Routing Views
// ==========================================================================

function navigateToView(viewName) {
  // Hide all views, activate target
  ['welcome', 'wizard', 'celebration', 'history'].forEach(v => {
    const elView = el['view' + v.charAt(0).toUpperCase() + v.slice(1)];
    if (v === viewName) {
      elView.classList.add('active-view');
    } else {
      elView.classList.remove('active-view');
    }
  });

  state.activeView = viewName;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Custom view entry triggers
  if (viewName === 'welcome') {
    checkDraftStatus();
    renderMiniDashboard();
  } else if (viewName === 'history') {
    renderHistoryDashboard();
  }
}

// Ensure theme toggle works seamlessly
function initTheme() {
  const savedTheme = localStorage.getItem('wecheck_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  el.themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('wecheck_theme', target);
    updateThemeIcon(target);
    showToast(`Switched to ${target === 'dark' ? 'Midnight Calm' : 'Calming Light'} mode`);
    
    // Redraw charts if history dashboard is active
    if (state.activeView === 'history') {
      renderHistoryDashboard();
    } else if (state.activeView === 'welcome') {
      renderMiniDashboard();
    }
  });
}

function updateThemeIcon(theme) {
  const sun = el.themeToggleBtn.querySelector('.sun-icon');
  const moon = el.themeToggleBtn.querySelector('.moon-icon');
  if (theme === 'dark') {
    sun.style.display = 'none';
    moon.style.display = 'block';
  } else {
    sun.style.display = 'block';
    moon.style.display = 'none';
  }
}

// ==========================================================================
// 4. Form Setup, Inputs configuration & Sliders
// ==========================================================================

function configureFormColumns() {
  const mode = el.checkinMode.value;
  state.mode = mode;
  document.body.className = ''; // reset classes

  const allCols = document.querySelectorAll('.partner-input-col');
  allCols.forEach(col => {
    col.classList.remove('disabled');
    col.style.display = '';
  });

  if (mode === 'carter') {
    // Hide Jurrand columns, show only Carter
    allCols.forEach(col => {
      if (col.id.includes('-j-') || col.id.endsWith('j-goals-page') || col.id.endsWith('j-couple-overview')) {
        col.style.display = 'none';
      }
    });
    document.body.classList.add('mode-carter');
  } else if (mode === 'jurrand') {
    // Hide Carter columns, show only Jurrand
    allCols.forEach(col => {
      if (col.id.includes('-c-') || col.id.endsWith('c-goals-page') || col.id.endsWith('c-couple-overview')) {
        col.style.display = 'none';
      }
    });
    document.body.classList.add('mode-jurrand');
  } else if (mode === 'sidebyside') {
    // Side by side visual layout
    document.body.classList.add('together-side-by-side');
  } else {
    // Alternating/together
    document.body.classList.add('together-alternating');
  }
}

function updateSliderFeedback(partner, val) {
  const feedback = scaleFeedback[val];
  el['val' + partner + 'Scale'].textContent = val;
  el['emoji' + partner + 'Scale'].textContent = feedback.emoji;
  el['text' + partner + 'Scale'].textContent = feedback.text;
}

function initFormControls() {
  // Connectedness sliders listener
  el.cScaleInput.addEventListener('input', (e) => updateSliderFeedback('C', e.target.value));
  el.jScaleInput.addEventListener('input', (e) => updateSliderFeedback('J', e.target.value));
  
  // Set initial slider values
  updateSliderFeedback('C', el.cScaleInput.value);
  updateSliderFeedback('J', el.jScaleInput.value);

  // Status buttons listeners for Carter & Jurrand assessment
  ['c', 'j'].forEach(partner => {
    const group = document.getElementById(`${partner}-status-group`);
    const hiddenInput = document.getElementById(`${partner}-couple-status`);
    if (group && hiddenInput) {
      group.addEventListener('click', (e) => {
        const btn = e.target.closest('.status-btn');
        if (!btn) return;
        
        group.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        hiddenInput.value = btn.dataset.status;
        saveDraft(); // Trigger autosave
      });
    }
  });

  // Attach heart floating sparkler to Appreciation inputs
  const appreciationTextareas = document.querySelectorAll('.appreciation-textarea');
  appreciationTextareas.forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      // Emit floating hearts on typing
      if (e.inputType === 'insertText') {
        createHeartParticle(textarea);
      }
    });
  });

  // Watch for text alignment checklist click
  ['c', 'j'].forEach(partner => {
    const goalsCheckbox = document.getElementById(`${partner}-goals-page`);
    if (goalsCheckbox) {
      goalsCheckbox.addEventListener('change', () => {
        saveDraft(); // Trigger autosave
      });
    }
  });

  // Setup generic dynamic auto-saving on typing
  el.checkinForm.querySelectorAll('textarea, input').forEach(input => {
    input.addEventListener('input', saveDraft);
  });
}

// Floating Heart Particle Emitter helper
function createHeartParticle(textarea) {
  const container = el.heartBurstEmitter;
  if (!container) return;

  const rect = textarea.getBoundingClientRect();
  const parentRect = container.getBoundingClientRect();

  const heart = document.createElement('span');
  heart.className = 'heart-particle';
  
  // Choose random cute pastel heart color
  const heartsList = ['💖', '💕', '💗', '🌸', '✨', '❤️'];
  heart.textContent = heartsList[Math.floor(Math.random() * heartsList.length)];
  
  // Position particles near the active typing area of textarea
  const x = rect.left - parentRect.left + (rect.width * 0.4) + (Math.random() * 40 - 20);
  const y = rect.top - parentRect.top + (rect.height * 0.5) + (Math.random() * 40 - 20);

  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;

  // Randomize floating drift distance
  const driftX = (Math.random() * 80 - 40);
  const driftY = -(Math.random() * 60 + 60);
  const driftRotate = (Math.random() * 60 - 30);
  
  heart.style.setProperty('--x', `${driftX}px`);
  heart.style.setProperty('--y', `${driftY}px`);
  heart.style.setProperty('--r', `${driftRotate}deg`);

  container.appendChild(heart);

  // Clean up
  setTimeout(() => {
    heart.remove();
  }, 1500);
}

// ==========================================================================
// 5. Check-In Wizard Flow Navigation
// ==========================================================================

function updateWizardStep() {
  const step = state.currentStep;

  // Active step visibility
  for (let i = 1; i <= 5; i++) {
    const elStep = document.getElementById('step-' + i);
    if (i === step) {
      elStep.classList.add('active-step');
    } else {
      elStep.classList.remove('active-step');
    }
  }

  // Update dots indicator
  el.stepDots.forEach(dot => {
    const dotStep = parseInt(dot.dataset.step);
    if (dotStep === step) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // Header Titles
  const meta = stepsMeta[step];
  el.wizardStepTitle.textContent = meta.title;
  el.wizardStepSubtitle.textContent = meta.subtitle;

  // Progress Bar Width
  const progressPercent = (step / 5) * 100;
  el.progressIndicator.style.width = `${progressPercent}%`;

  // Back Button visibility
  if (step === 1) {
    el.wizardBackBtn.style.visibility = 'hidden';
  } else {
    el.wizardBackBtn.style.visibility = 'visible';
  }

  // Next / Submit Button labels
  if (step === 5) {
    el.wizardNextBtn.textContent = 'Complete Check-In';
  } else {
    el.wizardNextBtn.textContent = 'Next';
  }

  // Scroll wizard container to top
  const formCard = document.querySelector('.wizard-content-card');
  formCard.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleWizardNext() {
  if (state.currentStep < 5) {
    state.currentStep++;
    updateWizardStep();
    saveDraft();
  } else {
    // Complete form!
    completeCheckIn();
  }
}

function handleWizardBack() {
  if (state.currentStep > 1) {
    state.currentStep--;
    updateWizardStep();
    saveDraft();
  }
}

function startNewCheckIn() {
  configureFormColumns();
  el.checkinForm.reset();
  
  // Set default slider values to 8
  el.cScaleInput.value = '8';
  el.jScaleInput.value = '8';
  updateSliderFeedback('C', 8);
  updateSliderFeedback('J', 8);

  // Set default statuses to Flowing Steady
  ['c', 'j'].forEach(partner => {
    const group = document.getElementById(`${partner}-status-group`);
    if (group) {
      group.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
      const defaultBtn = group.querySelector('[data-status="Flowing Steady"]');
      if (defaultBtn) defaultBtn.classList.add('active');
    }
    const hiddenInput = document.getElementById(`${partner}-couple-status`);
    if (hiddenInput) hiddenInput.value = 'Flowing Steady';
  });

  state.currentStep = 1;
  state.draft = {};
  updateWizardStep();
  navigateToView('wizard');
}

// ==========================================================================
// 6. Draft Persistence (localStorage Autosave)
// ==========================================================================

function saveDraft() {
  // Capture values in real-time
  const formData = new FormData(el.checkinForm);
  const answers = {};
  
  for (let [key, value] of formData.entries()) {
    answers[key] = value;
  }

  // Special checkbox capture
  answers.c_goals_page = el.cGoalsPage.checked;
  answers.j_goals_page = el.jGoalsPage.checked;

  state.draft = {
    step: state.currentStep,
    mode: state.mode,
    answers: answers,
    timestamp: Date.now()
  };

  localStorage.setItem('wecheck_draft', JSON.stringify(state.draft));
}

function checkDraftStatus() {
  const saved = localStorage.getItem('wecheck_draft');
  if (saved) {
    try {
      const draftData = JSON.parse(saved);
      if (draftData && draftData.answers && Object.keys(draftData.answers).length > 0) {
        el.resumeDraftBtn.style.display = 'inline-flex';
        return;
      }
    } catch(e) {
      console.error("Error checking draft status", e);
    }
  }
  el.resumeDraftBtn.style.display = 'none';
}

function resumeDraft() {
  const saved = localStorage.getItem('wecheck_draft');
  if (!saved) return;

  try {
    const draftData = JSON.parse(saved);
    state.mode = draftData.mode || 'together';
    el.checkinMode.value = state.mode;
    
    configureFormColumns();
    
    // Fill all form inputs
    const answers = draftData.answers || {};
    Object.keys(answers).forEach(key => {
      const input = el.checkinForm.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'range') {
          input.value = answers[key];
          const partner = key.startsWith('c_') ? 'C' : 'J';
          updateSliderFeedback(partner, answers[key]);
        } else if (input.type === 'checkbox') {
          // handled separately
        } else {
          input.value = answers[key];
        }
      }
    });

    // Checkboxes explicit mapping
    el.cGoalsPage.checked = !!answers.c_goals_page;
    el.jGoalsPage.checked = !!answers.j_goals_page;

    // Status mapping
    ['c', 'j'].forEach(partner => {
      const key = `${partner}_couple_status`;
      const val = answers[key] || 'Flowing Steady';
      const group = document.getElementById(`${partner}-status-group`);
      if (group) {
        group.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
        const targetBtn = group.querySelector(`[data-status="${val}"]`);
        if (targetBtn) targetBtn.classList.add('active');
      }
      const hiddenInput = document.getElementById(`${partner}-couple-status`);
      if (hiddenInput) hiddenInput.value = val;
    });

    state.currentStep = draftData.step || 1;
    updateWizardStep();
    navigateToView('wizard');
    showToast("Resumed draft from your last check-in");
  } catch(e) {
    console.error("Error resuming draft", e);
    showToast("Failed to restore draft, starting fresh.", 'error');
  }
}

// ==========================================================================
// 7. Completion & Custom Markdown Export
// ==========================================================================

function completeCheckIn() {
  saveDraft();
  
  // Prepare preview in celebration screen
  const answers = state.draft.answers;
  const formattedSummary = generateMarkdownSummary(answers, Date.now());
  el.summaryPreview.textContent = formattedSummary;

  navigateToView('celebration');
  
  // Custom celebration heart particle burst!
  triggerCelebrationHearts();
}

function triggerCelebrationHearts() {
  const container = el.viewCelebration;
  if (!container) return;

  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.className = 'heart-particle';
      const heartsList = ['💖', '💕', '💗', '🌸', '✨', '❤️'];
      heart.textContent = heartsList[Math.floor(Math.random() * heartsList.length)];
      
      const x = container.clientWidth * 0.5 + (Math.random() * 200 - 100);
      const y = container.clientHeight * 0.35 + (Math.random() * 100 - 50);

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;

      const driftX = (Math.random() * 260 - 130);
      const driftY = -(Math.random() * 200 + 100);
      const driftRotate = (Math.random() * 120 - 60);
      
      heart.style.setProperty('--x', `${driftX}px`);
      heart.style.setProperty('--y', `${driftY}px`);
      heart.style.setProperty('--r', `${driftRotate}deg`);

      container.appendChild(heart);

      setTimeout(() => heart.remove(), 1500);
    }, i * 45);
  }
}

/**
 * Builds the exact custom text checklist requested by the user,
 * dynamic to the selected entry mode configuration.
 */
function generateMarkdownSummary(answers, timestamp) {
  const dateStr = new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const getVal = (field) => {
    if (answers[field] === undefined || answers[field] === '') {
      return '[Unsubmitted]';
    }
    return answers[field];
  };

  const getYesNo = (field) => {
    const isChecked = !!answers[field];
    return isChecked ? 'Yes, fully aligned' : 'No, we need to talk';
  };

  const mode = state.mode;

  let out = `## Relationship Check-In: ${dateStr}\n\n`;

  // Section 1: Connectedness
  out += `1. Connectedness\n`;
  out += `On a scale of 1-10 how connected to me have you felt this week?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_scale')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_scale')}\n`;
  
  out += `\nWhat made you feel most connected to me?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_most_connected')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_most_connected')}\n`;
  
  out += `\nWhat made you feel distant from me?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_distant')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_distant')}\n`;

  // Section 2: Needs
  out += `\n2. Needs\n`;
  out += `What's one thing you need more of from me this week?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_more_of')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_more_of')}\n`;
  
  out += `\nWhat’s one thing you need less of?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_less_of')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_less_of')}\n`;
  
  out += `\nIs there anything from this week that's bothering you that you haven't mentioned?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_bothering')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_bothering')}\n`;

  // Section 3: Appreciation
  out += `\n3. Appreciation\n`;
  out += `What's something I did this week/month that made you feel loved?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_feel_loved')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_feel_loved')}\n`;
  
  out += `\nWhat's a quality of mine you're grateful for right now?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_grateful_quality')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_grateful_quality')}\n`;
  
  out += `\nWhat's something you appreciate about our relationship lately?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_appreciate_relationship')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_appreciate_relationship')}\n`;

  // Section 4: Goals/Future
  out += `\n4. Goals/Future\n`;
  out += `Are we still on the same page about goals?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getYesNo('c_goals_page')} - Note: ${getVal('c_goals_notes')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getYesNo('j_goals_page')} - Note: ${getVal('j_goals_notes')}\n`;
  
  out += `\nIs there anything about our future that is worrying you?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_future_worries')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_future_worries')}\n`;
  
  out += `\nWhat's something you're excited about regarding us?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_excited')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_excited')}\n`;

  // Section 5: Overview
  out += `\n5. Overview\n`;
  out += `How are we doing as a couple?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_couple_status')} - Note: ${getVal('c_couple_overview_notes')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_couple_status')} - Note: ${getVal('j_couple_overview_notes')}\n`;
  
  out += `\nWhat's one thing we could improve?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_improve')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_improve')}\n`;
  
  out += `\nWhat's working really well for us right now?\n`;
  if (mode !== 'jurrand') out += `Carter: ${getVal('c_working_well')}\n`;
  if (mode !== 'carter') out += `Jurrand: ${getVal('j_working_well')}\n`;

  return out;
}

function handleCopySummary() {
  const text = el.summaryPreview.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Template copied to clipboard!");
  }).catch(e => {
    console.error("Copy failed", e);
    showToast("Copy failed. Please manually highlight text.", 'error');
  });
}

function handleDownloadSummary() {
  const text = el.summaryPreview.textContent;
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  
  const dateSlug = new Date().toISOString().slice(0, 10);
  a.download = `wecheck_${dateSlug}.md`;
  
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast("Check-In Markdown downloaded!");
}

// Save active draft to history array and persist in localStorage
function saveCheckInToHistory() {
  if (!state.draft || !state.draft.answers) return;

  const timestamp = Date.now();
  const dateFormatted = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric'
  });

  const record = {
    id: timestamp,
    date: dateFormatted,
    timestamp: timestamp,
    mode: state.mode,
    answers: state.draft.answers
  };

  state.history.unshift(record); // Add to front of list
  localStorage.setItem('wecheck_history', JSON.stringify(state.history));
  localStorage.removeItem('wecheck_draft'); // clear draft

  showToast("Check-In saved to history!");
  navigateToView('history');
  saveCheckInToServer(record);
}

function discardDraftAndExit() {
  localStorage.removeItem('wecheck_draft');
  showToast("Draft cleared");
  navigateToView('welcome');
}

// ==========================================================================
// 8. History Timeline & Dynamic SVG Trend Charts
// ==========================================================================

// --- Unified Database API Helpers ---
async function fetchHistoryFromServer() {
  try {
    const res = await fetch('./api/history');
    if (!res.ok) throw new Error("HTTP error " + res.status);
    const serverHistory = await res.json();
    if (Array.isArray(serverHistory)) {
      console.log(`Fetched ${serverHistory.length} check-ins from MySQL database.`);
      const mergedMap = new Map();
      state.history.forEach(item => mergedMap.set(item.timestamp, item));
      serverHistory.forEach(item => mergedMap.set(item.timestamp, item));
      const mergedHistory = Array.from(mergedMap.values()).sort((a, b) => b.timestamp - a.timestamp);
      state.history = mergedHistory;
      localStorage.setItem('wecheck_history', JSON.stringify(state.history));
      if (state.activeView === 'history') {
        renderHistoryDashboard();
      } else if (state.activeView === 'welcome') {
        renderMiniDashboard();
      }
    }
  } catch (err) {
    console.warn("Could not sync check-ins from database server (offline mode):", err.message);
  }
}

async function saveCheckInToServer(record) {
  try {
    const res = await fetch('./api/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error("HTTP error " + res.status);
    console.log("Check-in synced to MySQL database successfully.");
  } catch (err) {
    console.warn("Could not push check-in to database server (saved locally):", err.message);
    showToast("Saved locally. Will sync to database when online.", 'info');
  }
}

async function syncAllWithServer() {
  if (state.history.length === 0) return;
  try {
    const res = await fetch('./api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkIns: state.history })
    });
    if (!res.ok) throw new Error("HTTP error " + res.status);
    console.log("All local check-ins successfully synced with database server.");
    await fetchHistoryFromServer();
  } catch (err) {
    console.warn("Auto-sync with database server failed (offline mode):", err.message);
  }
}

function loadHistory() {
  const todayStart = 1779256800000; // May 20, 2026 00:00:00-06:00
  const saved = localStorage.getItem('wecheck_history');
  if (saved) {
    try {
      state.history = JSON.parse(saved);
    } catch(e) {
      console.error("Failed parsing history, using default mock records", e);
      state.history = [...defaultHistory];
    }
  } else {
    state.history = [...defaultHistory];
  }
  
  // Filter out any check-ins before today (May 20, 2026)
  const originalLength = state.history.length;
  state.history = state.history.filter(item => item.timestamp >= todayStart);
  if (state.history.length !== originalLength) {
    console.log(`Cleared ${originalLength - state.history.length} pre-today check-ins from local state.`);
    localStorage.setItem('wecheck_history', JSON.stringify(state.history));
  }
  
  // Background sync trigger
  syncAllWithServer().then(() => fetchHistoryFromServer());
}

function renderHistoryDashboard() {
  const container = el.historyContainer;
  container.innerHTML = '';

  if (state.history.length === 0) {
    el.emptyHistory.style.display = 'flex';
    el.trendSvg.innerHTML = '<text x="300" y="110" text-anchor="middle" fill="#5a6e62" font-size="14">No data to chart. Complete your first check-in!</text>';
    return;
  }

  el.emptyHistory.style.display = 'none';

  // Render list of items
  state.history.forEach(item => {
    const li = document.createElement('li');
    li.className = 'history-item-row';
    
    // Average scores
    const cScore = item.answers.c_scale ? parseInt(item.answers.c_scale) : null;
    const jScore = item.answers.j_scale ? parseInt(item.answers.j_scale) : null;

    let scoresBadgesHtml = '';
    if (item.mode !== 'jurrand' && cScore !== null) {
      scoresBadgesHtml += `<span class="score-badge c-badge">Carter: ${cScore}</span>`;
    }
    if (item.mode !== 'carter' && jScore !== null) {
      scoresBadgesHtml += `<span class="score-badge j-badge">Jurrand: ${jScore}</span>`;
    }

    li.innerHTML = `
      <div class="item-info">
        <span class="item-date">${item.date}</span>
        <span class="item-meta">Completed in ${item.mode === 'together' || item.mode === 'sidebyside' ? 'Together' : item.mode.charAt(0).toUpperCase() + item.mode.slice(1) + "'s"} Mode</span>
      </div>
      <div class="item-scores">
        ${scoresBadgesHtml}
      </div>
    `;

    li.addEventListener('click', () => openCheckInDetailsModal(item));
    container.appendChild(li);
  });

  // Render Chart with active range filter selection
  const activeRangeBtn = document.querySelector('.chart-filters .filter-btn.active');
  const activeRange = activeRangeBtn ? activeRangeBtn.dataset.range : 'all';
  drawTrendChart(activeRange);
}

function renderMiniDashboard() {
  if (state.history.length === 0) {
    el.quickInsights.style.display = 'none';
    return;
  }

  el.quickInsights.style.display = 'block';

  // Calculate Average score of last 5 check-ins
  const items = state.history.slice(0, 5);
  let totalScore = 0;
  let scoreCount = 0;

  items.forEach(it => {
    if (it.answers.c_scale) {
      totalScore += parseInt(it.answers.c_scale);
      scoreCount++;
    }
    if (it.answers.j_scale) {
      totalScore += parseInt(it.answers.j_scale);
      scoreCount++;
    }
  });

  const avg = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '8.0';
  el.quickInsightsText.textContent = `Your connection score averaged ${avg} over the last ${items.length} check-ins.`;

  // Draw simple sparkline trend chart
  drawSparklineChart();
}

/**
 * Renders the primary double-line trends chart on the insights dashboard.
 * Supports filtering records by 'all', '3months', and '4weeks'.
 */
function drawTrendChart(range) {
  const svg = el.trendSvg;
  svg.innerHTML = ''; // reset

  // Filter history records based on user selector
  let records = [...state.history];
  
  // Sort oldest to newest for chronological left-to-right drawing
  records.sort((a, b) => a.timestamp - b.timestamp);

  const now = Date.now();
  if (range === '3months') {
    const limit = now - (90 * 24 * 60 * 60 * 1000);
    records = records.filter(r => r.timestamp >= limit);
  } else if (range === '4weeks') {
    const limit = now - (28 * 24 * 60 * 60 * 1000);
    records = records.filter(r => r.timestamp >= limit);
  }

  if (records.length === 0) {
    svg.innerHTML = '<text x="300" y="110" text-anchor="middle" fill="#5a6e62" font-size="14">No data in this time range.</text>';
    return;
  }

  // Setup gradient shaders programmatically
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const labelColor = isDark ? '#9bb0a3' : '#5a6e62';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(122, 154, 130, 0.12)';

  svg.innerHTML = `
    <defs>
      <linearGradient id="area-grad-carter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d69486" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#d69486" stop-opacity="0.0"/>
      </linearGradient>
      <linearGradient id="area-grad-jurrand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#7a9a82" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#7a9a82" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
  `;

  // Draw Y-Axis grid lines & labels (1 to 10 scale)
  const chartHeight = 170;
  const chartWidth = 520;
  const paddingLeft = 50;
  const paddingTop = 20;

  for (let i = 1; i <= 10; i++) {
    const y = paddingTop + chartHeight - ((i - 1) / 9) * chartHeight;
    // Horizontal grid line
    const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    gridLine.setAttribute('x1', paddingLeft);
    gridLine.setAttribute('y1', y);
    gridLine.setAttribute('x2', paddingLeft + chartWidth);
    gridLine.setAttribute('y2', y);
    gridLine.setAttribute('stroke', gridColor);
    gridLine.setAttribute('stroke-dasharray', i % 2 === 0 ? 'none' : '2 2');
    svg.appendChild(gridLine);

    // Y Axis label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', paddingLeft - 15);
    text.setAttribute('y', y + 3);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', labelColor);
    text.setAttribute('font-size', '10px');
    text.textContent = i;
    svg.appendChild(text);
  }

  // Calculate coordinates of each data point
  const n = records.length;
  const pointsC = [];
  const pointsJ = [];

  records.forEach((record, index) => {
    // X coordinate distribution
    const x = paddingLeft + (n > 1 ? (index / (n - 1)) * chartWidth : chartWidth / 2);
    
    // Y coordinates
    const scoreC = record.answers.c_scale ? parseInt(record.answers.c_scale) : null;
    const scoreJ = record.answers.j_scale ? parseInt(record.answers.j_scale) : null;

    if (record.mode !== 'jurrand' && scoreC !== null) {
      const yC = paddingTop + chartHeight - ((scoreC - 1) / 9) * chartHeight;
      pointsC.push({ x, y: yC, val: scoreC, date: record.date });
    }
    if (record.mode !== 'carter' && scoreJ !== null) {
      const yJ = paddingTop + chartHeight - ((scoreJ - 1) / 9) * chartHeight;
      pointsJ.push({ x, y: yJ, val: scoreJ, date: record.date });
    }

    // Draw date labels on X axis
    const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    dateText.setAttribute('x', x);
    dateText.setAttribute('y', paddingTop + chartHeight + 20);
    dateText.setAttribute('text-anchor', 'middle');
    dateText.setAttribute('fill', labelColor);
    dateText.setAttribute('font-size', '10px');
    
    // Abbreviate date slug for clean rendering
    const cleanDate = record.date.slice(0, 6);
    dateText.textContent = cleanDate;
    svg.appendChild(dateText);
  });

  // Draw area gradients under paths
  if (pointsC.length > 1) {
    let dArea = `M ${pointsC[0].x} ${paddingTop + chartHeight} `;
    pointsC.forEach(p => { dArea += `L ${p.x} ${p.y} `; });
    dArea += `L ${pointsC[pointsC.length - 1].x} ${paddingTop + chartHeight} Z`;

    const areaC = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaC.setAttribute('d', dArea);
    areaC.setAttribute('class', 'chart-area-carter');
    svg.appendChild(areaC);
  }

  if (pointsJ.length > 1) {
    let dArea = `M ${pointsJ[0].x} ${paddingTop + chartHeight} `;
    pointsJ.forEach(p => { dArea += `L ${p.x} ${p.y} `; });
    dArea += `L ${pointsJ[pointsJ.length - 1].x} ${paddingTop + chartHeight} Z`;

    const areaJ = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaJ.setAttribute('d', dArea);
    areaJ.setAttribute('class', 'chart-area-jurrand');
    svg.appendChild(areaJ);
  }

  // Draw line paths
  if (pointsC.length > 1) {
    let dLine = `M ${pointsC[0].x} ${pointsC[0].y} `;
    for (let i = 1; i < pointsC.length; i++) {
      // Bezier curve calculations for relaxing smooth chart line
      const cpX1 = pointsC[i - 1].x + (pointsC[i].x - pointsC[i - 1].x) / 2;
      const cpY1 = pointsC[i - 1].y;
      const cpX2 = pointsC[i - 1].x + (pointsC[i].x - pointsC[i - 1].x) / 2;
      const cpY2 = pointsC[i].y;
      dLine += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pointsC[i].x} ${pointsC[i].y} `;
    }

    const lineC = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lineC.setAttribute('d', dLine);
    lineC.setAttribute('class', 'chart-line-carter');
    svg.appendChild(lineC);
  } else if (pointsC.length === 1) {
    // single dot fallback handled in markers section below
  }

  if (pointsJ.length > 1) {
    let dLine = `M ${pointsJ[0].x} ${pointsJ[0].y} `;
    for (let i = 1; i < pointsJ.length; i++) {
      const cpX1 = pointsJ[i - 1].x + (pointsJ[i].x - pointsJ[i - 1].x) / 2;
      const cpY1 = pointsJ[i - 1].y;
      const cpX2 = pointsJ[i - 1].x + (pointsJ[i].x - pointsJ[i - 1].x) / 2;
      const cpY2 = pointsJ[i].y;
      dLine += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pointsJ[i].x} ${pointsJ[i].y} `;
    }

    const lineJ = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lineJ.setAttribute('d', dLine);
    lineJ.setAttribute('class', 'chart-line-jurrand');
    svg.appendChild(lineJ);
  }

  // Draw interactive markers/dots
  pointsC.forEach(p => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    dot.setAttribute('r', '5');
    dot.setAttribute('class', 'chart-dot-carter');
    
    // Dynamic SVG tooltip details on click/hover
    dot.addEventListener('click', () => {
      showToast(`Carter: ${p.val} on ${p.date}`);
    });
    svg.appendChild(dot);
  });

  pointsJ.forEach(p => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    dot.setAttribute('r', '5');
    dot.setAttribute('class', 'chart-dot-jurrand');
    
    dot.addEventListener('click', () => {
      showToast(`Jurrand: ${p.val} on ${p.date}`);
    });
    svg.appendChild(dot);
  });
}

// Draw a very simple sparkline for the Welcome page quick insight element
function drawSparklineChart() {
  const svg = el.miniTrendChart;
  svg.innerHTML = ''; // reset

  let records = [...state.history].slice(0, 5); // last 5 only
  records.sort((a,b) => a.timestamp - b.timestamp);

  const w = svg.clientWidth || 300;
  const h = 80;
  const pad = 10;
  const stepX = (w - pad * 2) / (records.length > 1 ? records.length - 1 : 1);

  const points = [];
  records.forEach((r, idx) => {
    const cScale = r.answers.c_scale ? parseInt(r.answers.c_scale) : 8;
    const jScale = r.answers.j_scale ? parseInt(r.answers.j_scale) : 8;
    const avg = (cScale + jScale) / 2;

    const x = pad + idx * stepX;
    const y = h - pad - ((avg - 1) / 9) * (h - pad * 2);
    points.push({ x, y });
  });

  if (points.length > 1) {
    let d = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      d += `L ${points[i].x} ${points[i].y} `;
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#7a9a82');
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
  }

  // Draw dots
  points.forEach(p => {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    dot.setAttribute('r', '3.5');
    dot.setAttribute('fill', '#ffffff');
    dot.setAttribute('stroke', '#7a9a82');
    dot.setAttribute('stroke-width', '1.5');
    svg.appendChild(dot);
  });
}

// ==========================================================================
// 9. Past Check-in Details Overlay/Dialog (Modal)
// ==========================================================================

function openCheckInDetailsModal(item) {
  el.modalTitle.textContent = `Check-In Details: ${item.date}`;
  
  // Format answers for modal
  const answers = item.answers;
  const mode = item.mode;

  const renderCol = (title, field, cField, jField, type = 'text') => {
    const getVal = (f) => answers[f] || '—';
    
    let leftHtml = '';
    let rightHtml = '';

    if (type === 'scale') {
      if (mode !== 'jurrand') {
        const val = getVal('c_scale');
        const feedback = scaleFeedback[val] || { emoji: '😊', text: 'Warm' };
        leftHtml = `<strong>${val}</strong> <span class="text-xs">${feedback.emoji} ${feedback.text}</span>`;
      }
      if (mode !== 'carter') {
        const val = getVal('j_scale');
        const feedback = scaleFeedback[val] || { emoji: '😊', text: 'Warm' };
        rightHtml = `<strong>${val}</strong> <span class="text-xs">${feedback.emoji} ${feedback.text}</span>`;
      }
    } else if (type === 'bool') {
      if (mode !== 'jurrand') {
        leftHtml = answers.c_goals_page ? 'Yes, fully aligned' : 'No, let\'s talk';
        if (answers.c_goals_notes) leftHtml += `<div class="mt-xs text-xs" style="opacity:0.8;">Note: ${answers.c_goals_notes}</div>`;
      }
      if (mode !== 'carter') {
        rightHtml = answers.j_goals_page ? 'Yes, fully aligned' : 'No, let\'s talk';
        if (answers.j_goals_notes) rightHtml += `<div class="mt-xs text-xs" style="opacity:0.8;">Note: ${answers.j_goals_notes}</div>`;
      }
    } else {
      if (mode !== 'jurrand') leftHtml = getVal(cField);
      if (mode !== 'carter') rightHtml = getVal(jField);
    }

    let innerCols = '';
    if (mode !== 'jurrand') {
      innerCols += `
        <div class="modal-ans-card c-ans">
          <div class="name-tag">Carter</div>
          <div class="content-text">${leftHtml}</div>
        </div>
      `;
    }
    if (mode !== 'carter') {
      innerCols += `
        <div class="modal-ans-card j-ans">
          <div class="name-tag">Jurrand</div>
          <div class="content-text">${rightHtml}</div>
        </div>
      `;
    }

    return `
      <div class="modal-q-block">
        <h4>${title}</h4>
        <div class="modal-answers-row">
          ${innerCols}
        </div>
      </div>
    `;
  };

  let bodyHtml = '';

  // 1. Connection
  bodyHtml += `
    <div class="modal-section">
      <h3 class="modal-section-title">1. Connectedness</h3>
      ${renderCol('Connection scale (1-10)', null, 'c_scale', 'j_scale', 'scale')}
      ${renderCol('What made you feel most connected?', null, 'c_most_connected', 'j_most_connected')}
      ${renderCol('What made you feel distant?', null, 'c_distant', 'j_distant')}
    </div>
  `;

  // 2. Needs
  bodyHtml += `
    <div class="modal-section">
      <h3 class="modal-section-title">2. Needs</h3>
      ${renderCol('Need more of:', null, 'c_more_of', 'j_more_of')}
      ${renderCol('Need less of:', null, 'c_less_of', 'j_less_of')}
      ${renderCol('Bothering you that went unmentioned:', null, 'c_bothering', 'j_bothering')}
    </div>
  `;

  // 3. Gratitude
  bodyHtml += `
    <div class="modal-section">
      <h3 class="modal-section-title">3. Appreciation</h3>
      ${renderCol('Felt loved by what action:', null, 'c_feel_loved', 'j_feel_loved')}
      ${renderCol('Grateful for which quality:', null, 'c_grateful_quality', 'j_grateful_quality')}
      ${renderCol('Appreciate about relationship:', null, 'c_appreciate_relationship', 'j_appreciate_relationship')}
    </div>
  `;

  // 4. Goals
  bodyHtml += `
    <div class="modal-section">
      <h3 class="modal-section-title">4. Goals & Future</h3>
      ${renderCol('Still on same page about goals?', null, 'c_goals_page', 'j_goals_page', 'bool')}
      ${renderCol('Worries about the future:', null, 'c_future_worries', 'j_future_worries')}
      ${renderCol('Excited about:', null, 'c_excited', 'j_excited')}
    </div>
  `;

  // 5. Overview
  bodyHtml += `
    <div class="modal-section">
      <h3 class="modal-section-title">5. Overview</h3>
      ${renderCol('How are we doing as a couple?', null, 'c_couple_status', 'j_couple_status')}
      ${renderCol('One thing to improve:', null, 'c_improve', 'j_improve')}
      ${renderCol('Working really well:', null, 'c_working_well', 'j_working_well')}
    </div>
  `;

  el.modalBody.innerHTML = bodyHtml;
  
  // Modal Copy listener
  el.modalCopyBtn.onclick = () => {
    const formatted = generateMarkdownSummary(answers, item.timestamp);
    navigator.clipboard.writeText(formatted).then(() => {
      showToast("Check-In copied to clipboard!");
    });
  };

  el.modal.classList.add('active-modal');
  document.body.style.overflow = 'hidden'; // block page scroll
}

function closeDetailsModal() {
  el.modal.classList.remove('active-modal');
  document.body.style.overflow = '';
}

// ==========================================================================
// 10. Database Backup / Restore & Utilities
// ==========================================================================

function handleDatabaseBackup() {
  const jsonStr = JSON.stringify(state.history, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  
  const dateSlug = new Date().toISOString().slice(0, 10);
  a.download = `wecheck_database_backup_${dateSlug}.json`;
  
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast("Database backup downloaded!");
}

function handleDatabaseRestoreClick() {
  el.dbFileInput.click();
}

function handleDatabaseRestore(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if (Array.isArray(data)) {
        // Simple verification that records contain answers
        const looksValid = data.length === 0 || (data[0].answers && data[0].date);
        if (looksValid) {
          state.history = data;
          localStorage.setItem('wecheck_history', JSON.stringify(state.history));
          showToast("Database restored successfully!");
          renderHistoryDashboard();
          syncAllWithServer(); // Push imports to server DB
          
          // Clear file selector input so same file can be uploaded again
          el.dbFileInput.value = '';
        } else {
          showToast("Invalid backup file structure", 'error');
        }
      } else {
        showToast("Backup file must be a list of records", 'error');
      }
    } catch(err) {
      console.error(err);
      showToast("Error parsing backup JSON file", 'error');
    }
  };
  reader.readAsText(file);
}

function clearDatabase() {
  if (confirm("Are you absolutely sure you want to clear your entire check-in history? This cannot be undone.")) {
    const historyToDelete = [...state.history];
    state.history = [];
    localStorage.removeItem('wecheck_history');
    showToast("History database cleared completely.");
    renderHistoryDashboard();
    
    historyToDelete.forEach(item => {
      fetch(`./api/check-in/${item.timestamp}`, { method: 'DELETE' })
        .catch(err => console.warn(`Could not delete check-in ${item.timestamp} on server:`, err));
    });
  }
}

// ==========================================================================
// 11. Toast System Notification Panel
// ==========================================================================

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type === 'error' ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close-btn" style="background:none; border:none; color:inherit; font-size:1.1rem; line-height:1; cursor:pointer;" aria-label="Close notification">&times;</button>
  `;

  // Attach close trigger
  toast.querySelector('.toast-close-btn').addEventListener('click', () => {
    toast.remove();
  });

  el.toastContainer.appendChild(toast);

  // Auto remove toast after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'toastSlideIn 0.35s ease-in reverse forwards';
      setTimeout(() => toast.remove(), 350);
    }
  }, 3000);
}

// ==========================================================================
// 12. Register Event Handlers & Entrypoint
// ==========================================================================

function registerEvents() {
  // Navigation Links
  el.navHistoryBtn.addEventListener('click', () => navigateToView('history'));
  el.backFromHistoryBtn.addEventListener('click', () => navigateToView('welcome'));

  // Welcome page buttons
  el.startCheckinBtn.addEventListener('click', startNewCheckIn);
  el.resumeDraftBtn.addEventListener('click', resumeDraft);
  el.checkinMode.addEventListener('change', configureFormColumns);

  // Form Controls back/next/cancel
  el.wizardNextBtn.addEventListener('click', handleWizardNext);
  el.wizardBackBtn.addEventListener('click', handleWizardBack);
  el.wizardCancelBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to cancel? Your draft is safe in draft storage, but you will return to the home screen.")) {
      navigateToView('welcome');
    }
  });

  // Export elements
  el.copySummaryBtn.addEventListener('click', handleCopySummary);
  el.downloadSummaryBtn.addEventListener('click', handleDownloadSummary);
  el.saveHistoryBtn.addEventListener('click', saveCheckInToHistory);
  el.discardDraftBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to exit to dashboard? Any uncompleted draft changes will be discarded.")) {
      discardDraftAndExit();
    }
  });

  // Chart range filter clicks
  el.chartFilterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      el.chartFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawTrendChart(btn.dataset.range);
    });
  });

  // Modal dialog close events
  el.modalCloseBtn.addEventListener('click', closeDetailsModal);
  el.modalCloseActionBtn.addEventListener('click', closeDetailsModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === el.modal) {
      closeDetailsModal();
    }
  });

  // Database backups listeners
  el.backupBtn.addEventListener('click', handleDatabaseBackup);
  el.restoreBtn.addEventListener('click', handleDatabaseRestoreClick);
  el.dbFileInput.addEventListener('change', handleDatabaseRestore);
  el.clearDbBtn.addEventListener('click', clearDatabase);
}

// App initial setup
function init() {
  initTheme();
  loadHistory();
  initFormControls();
  registerEvents();
  configureFormColumns();
  
  // Register PWA service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered successfully:', reg.scope))
        .catch(err => console.log('Service Worker registration failed:', err));
    });
  }
  
  // Route to initial welcome view
  navigateToView('welcome');
  
  // Dynamic resize handler for redrawing SVGs properly
  window.addEventListener('resize', () => {
    if (state.activeView === 'history') {
      const range = document.querySelector('.chart-filters .filter-btn.active').dataset.range;
      drawTrendChart(range);
    } else if (state.activeView === 'welcome') {
      renderMiniDashboard();
    }
  });
}

// Let it begin!
document.addEventListener('DOMContentLoaded', init);
