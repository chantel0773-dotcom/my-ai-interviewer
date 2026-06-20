/* app.js - Main Application Controller for My AI Interviewer */

document.addEventListener('DOMContentLoaded', () => {
  // --- State Variable ---
  let userProfile = {
    major: '',
    job: '',
    projects: '',
    intro: ''
  };
  let settings = {
    persona: 'professional',
    questionCount: 5,
    useVoice: true
  };
  let currentQuestion = '';
  let isRecording = false;
  let recognition = null;
  let synth = window.speechSynthesis;
  let currentUtterance = null;
  let radarChartInstance = null;

  // --- UI Elements ---
  const views = {
    home: document.getElementById('view-home'),
    onboarding: document.getElementById('view-onboarding'),
    lobby: document.getElementById('view-lobby'),
    interview: document.getElementById('view-interview'),
    report: document.getElementById('view-report')
  };

  // Buttons
  const btnStartApp = document.getElementById('btn-start-app');
  const btnHomeLogo = document.getElementById('btn-home-logo');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const btnShowKeyModal = document.getElementById('btn-show-key-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCloseModalCancel = document.getElementById('btn-close-modal-cancel');
  const btnSaveApiKey = document.getElementById('btn-save-api-key');
  const btnDeleteApiKey = document.getElementById('btn-delete-api-key');
  const btnToggleKeyVisibility = document.getElementById('btn-toggle-key-visibility');
  const btnStartInterview = document.getElementById('btn-start-interview');
  const btnBackToOnboarding = document.getElementById('btn-back-to-onboarding');
  const btnSpeakAgain = document.getElementById('btn-speak-again');
  const btnQuitInterview = document.getElementById('btn-quit-interview');
  const btnSubmitAnswer = document.getElementById('btn-submit-answer');
  const btnSttToggle = document.getElementById('btn-stt-toggle');
  const btnPrintReport = document.getElementById('btn-print-report');
  const btnRestart = document.getElementById('btn-restart');
  const btnBackHomeList = document.querySelectorAll('.btn-back-home');

  // Modals & Overlays
  const modalApi = document.getElementById('modal-api');
  const overlayProcessing = document.getElementById('overlay-processing');
  const textProcessingTitle = document.getElementById('text-processing-title');
  const textProcessingDesc = document.getElementById('text-processing-desc');

  // Input Controls
  const formProfile = document.getElementById('form-profile');
  const inputMajor = document.getElementById('input-major');
  const inputJob = document.getElementById('input-job');
  const inputProjects = document.getElementById('input-projects');
  const inputIntro = document.getElementById('input-intro');
  const inputApiKey = document.getElementById('input-api-key');
  const chkUseVoice = document.getElementById('chk-use-voice');
  const selectQuestionCount = document.getElementById('select-question-count');
  const textareaAnswer = document.getElementById('textarea-answer');
  const charCounter = document.getElementById('char-counter');

  // Dynamic Panels
  const lobbyApiStatus = document.getElementById('lobby-api-status');
  const lobbyNoApiStatus = document.getElementById('lobby-no-api-status');
  const chatHistoryContainer = document.getElementById('chat-history-container');
  const textProgressRatio = document.getElementById('text-progress-ratio');
  const textVoiceMode = document.getElementById('text-voice-mode');
  const interviewProgressBar = document.getElementById('interview-progress-bar');
  const speechStatusBanner = document.getElementById('speech-status-banner');
  const avatarArea = document.querySelector('.avatar-area');
  const textInterviewerName = document.getElementById('text-interviewer-name');
  const textInterviewerType = document.getElementById('text-interviewer-type');
  const avatarIcon = document.getElementById('avatar-icon');

  // Report Elements
  const textReportDate = document.getElementById('text-report-date');
  const textReportJob = document.getElementById('text-report-job');
  const textTotalScore = document.getElementById('text-total-score');
  const scoreFit = document.getElementById('score-fit');
  const scoreExperience = document.getElementById('score-experience');
  const scoreLogic = document.getElementById('score-logic');
  const scoreExpert = document.getElementById('score-expert');
  const scoreDelivery = document.getElementById('score-delivery');
  const textFeedbackStrengths = document.getElementById('text-feedback-strengths');
  const textFeedbackWeaknesses = document.getElementById('text-feedback-weaknesses');
  const textFeedbackImprovements = document.getElementById('text-feedback-improvements');
  const qaDetailsContainer = document.getElementById('qa-details-container');

  // --- Initialize App ---
  initApp();

  function initApp() {
    // 1. Restore theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      btnThemeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    // 2. Load API Key if exists
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      inputApiKey.value = savedKey;
      window.InterviewEngine.setApiKey(savedKey);
    }
    updateLobbyApiStatus();

    // 3. Restore profile from localstorage for UX convenience
    const cachedProfile = localStorage.getItem('user_profile_cache');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        inputMajor.value = parsed.major || '';
        inputJob.value = parsed.job || '';
        inputProjects.value = parsed.projects || '';
        inputIntro.value = parsed.intro || '';
      } catch (e) {
        console.error("Cached profile parsing failed", e);
      }
    }

    // 4. Initialize STT Engine if browser supports it
    initSpeechRecognition();
  }

  // --- View Router ---
  function showView(viewId) {
    // Stop speaking when transitioning
    stopSpeaking();
    stopRecording();
    
    Object.keys(views).forEach(key => {
      if (key === viewId) {
        views[key].classList.add('active');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        views[key].classList.remove('active');
      }
    });
  }

  // --- API Key Modal & Status ---
  function updateLobbyApiStatus() {
    const hasKey = window.InterviewEngine.hasValidApiKey();
    if (hasKey) {
      lobbyApiStatus.classList.remove('hidden');
      lobbyNoApiStatus.classList.add('hidden');
      btnShowKeyModal.innerHTML = '<i class="fa-solid fa-key text-teal"></i> Gemini API 설정됨';
    } else {
      lobbyApiStatus.classList.add('hidden');
      lobbyNoApiStatus.classList.remove('hidden');
      btnShowKeyModal.innerHTML = '<i class="fa-solid fa-key"></i> Gemini API 설정';
    }
  }

  // --- Toast Notification System ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exmark';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'toast-slide-in 0.3s reverse forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
  }

  // --- Web Speech API: TTS (Voice Synthesis) ---
  function speakText(text) {
    if (!settings.useVoice || !synth) return;
    
    // Stop ongoing speech
    stopSpeaking();

    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Setup Korean voice if available
    const voices = synth.getVoices();
    const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.startsWith('ko-KR'));
    if (koVoice) {
      currentUtterance.voice = koVoice;
    }
    
    // Adjust pitch and rate based on persona
    if (settings.persona === 'strict') {
      currentUtterance.rate = 1.05;
      currentUtterance.pitch = 0.9; // Lower voice
    } else if (settings.persona === 'friendly') {
      currentUtterance.rate = 0.95;
      currentUtterance.pitch = 1.1; // Softer voice
    } else {
      currentUtterance.rate = 1.0;
      currentUtterance.pitch = 1.0;
    }

    currentUtterance.onstart = () => {
      avatarArea.classList.add('speaking-active');
    };

    currentUtterance.onend = () => {
      avatarArea.classList.remove('speaking-active');
    };

    currentUtterance.onerror = (e) => {
      console.error("Speech error", e);
      avatarArea.classList.remove('speaking-active');
    };

    synth.speak(currentUtterance);
  }

  function stopSpeaking() {
    if (synth && synth.speaking) {
      synth.cancel();
    }
    avatarArea.classList.remove('speaking-active');
  }

  // --- Web Speech API: STT (Speech Recognition) ---
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      btnSttToggle.style.display = 'none';
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.onstart = () => {
      isRecording = true;
      btnSttToggle.classList.add('active');
      btnSttToggle.innerHTML = '<i class="fa-solid fa-microphone"></i>';
      speechStatusBanner.classList.remove('hidden');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        // Append result to textarea
        const currentText = textareaAnswer.value;
        textareaAnswer.value = currentText + (currentText ? ' ' : '') + finalTranscript;
        updateCharCounter();
      }
    };

    recognition.onerror = (event) => {
      console.error("STT Error:", event.error);
      if (event.error !== 'no-speech') {
        showToast("음성 인식 과정에서 오류가 발생했습니다: " + event.error, "error");
        stopRecording();
      }
    };

    recognition.onend = () => {
      isRecording = false;
      btnSttToggle.classList.remove('active');
      btnSttToggle.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>';
      speechStatusBanner.classList.add('hidden');
    };
  }

  function startRecording() {
    if (recognition && !isRecording) {
      // Stop TTS voice if speaking
      stopSpeaking();
      try {
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  }

  function stopRecording() {
    if (recognition && isRecording) {
      recognition.stop();
    }
  }

  // --- UI Helper: Chat Bubbles ---
  function addChatMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message ${sender}`;
    bubble.innerHTML = `
      <div class="message-bubble">${text}</div>
    `;
    chatHistoryContainer.appendChild(bubble);
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
  }

  function addLoadingBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-message bot typing-indicator-bubble';
    bubble.id = 'chat-loading-bubble';
    bubble.innerHTML = `
      <div class="message-bubble" style="display: flex; gap: 4px; padding: 12px 20px;">
        <span class="dot" style="width:8px; height:8px; background:var(--text-muted); border-radius:50%; animation: dot-pulse 1s infinite alternate;"></span>
        <span class="dot" style="width:8px; height:8px; background:var(--text-muted); border-radius:50%; animation: dot-pulse 1s infinite alternate 0.2s;"></span>
        <span class="dot" style="width:8px; height:8px; background:var(--text-muted); border-radius:50%; animation: dot-pulse 1s infinite alternate 0.4s;"></span>
      </div>
    `;
    chatHistoryContainer.appendChild(bubble);
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
  }

  function removeLoadingBubble() {
    const bubble = document.getElementById('chat-loading-bubble');
    if (bubble) {
      bubble.remove();
    }
  }

  function updateCharCounter() {
    const len = textareaAnswer.value.length;
    charCounter.textContent = `${len}자`;
  }

  // --- Event Bindings ---

  // Logo Click
  btnHomeLogo.addEventListener('click', () => {
    if (views.interview.classList.contains('active')) {
      if (confirm("면접이 진행 중입니다. 정말로 중단하고 홈으로 이동하시겠습니까?")) {
        showView('home');
      }
    } else {
      showView('home');
    }
  });

  // Start App
  btnStartApp.addEventListener('click', () => {
    showView('onboarding');
  });

  // Theme Toggle
  btnThemeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    if (isDark) {
      btnThemeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      btnThemeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
    // Re-draw radar chart if visible to match grid color
    if (views.report.classList.contains('active') && radarChartInstance) {
      drawRadarChart(radarChartInstance.data.datasets[0].data);
    }
  });

  // API Modal Trigger
  btnShowKeyModal.addEventListener('click', () => {
    modalApi.classList.add('active');
  });

  btnCloseModal.addEventListener('click', () => {
    modalApi.classList.remove('active');
  });

  btnCloseModalCancel.addEventListener('click', () => {
    modalApi.classList.remove('active');
  });

  btnToggleKeyVisibility.addEventListener('click', () => {
    if (inputApiKey.type === 'password') {
      inputApiKey.type = 'text';
      btnToggleKeyVisibility.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      inputApiKey.type = 'password';
      btnToggleKeyVisibility.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  });

  btnSaveApiKey.addEventListener('click', () => {
    const key = inputApiKey.value.trim();
    if (key && !key.startsWith('AIzaSy')) {
      showToast("올바른 형식의 Gemini API Key가 아닙니다.", "error");
      return;
    }
    window.InterviewEngine.setApiKey(key);
    updateLobbyApiStatus();
    modalApi.classList.remove('active');
    if (key) {
      showToast("Gemini API Key가 성공적으로 저장되었습니다.", "success");
    } else {
      showToast("Gemini API Key가 삭제되었습니다. 로컬 모드로 작동합니다.", "info");
    }
  });

  btnDeleteApiKey.addEventListener('click', () => {
    inputApiKey.value = '';
    window.InterviewEngine.setApiKey('');
    updateLobbyApiStatus();
    modalApi.classList.remove('active');
    showToast("API Key가 삭제되었습니다. 로컬 시나리오 엔진을 사용합니다.", "info");
  });

  // Profile Form Submit (Step 1 -> Step 2)
  formProfile.addEventListener('submit', (e) => {
    e.preventDefault();
    userProfile.major = inputMajor.value.trim();
    userProfile.job = inputJob.value.trim();
    userProfile.projects = inputProjects.value.trim();
    userProfile.intro = inputIntro.value.trim();

    // Cache profile
    localStorage.setItem('user_profile_cache', JSON.stringify(userProfile));

    // Move to Lobby
    showView('lobby');
  });

  // Lobby Back Button
  btnBackToOnboarding.addEventListener('click', () => {
    showView('onboarding');
  });

  btnBackHomeList.forEach(btn => {
    btn.addEventListener('click', () => {
      showView('home');
    });
  });

  // Start Interview (Step 2 -> Step 3)
  btnStartInterview.addEventListener('click', async () => {
    // 1. Gather lobby settings
    const selectedPersona = document.querySelector('input[name="persona"]:checked').value;
    settings.persona = selectedPersona;
    settings.questionCount = parseInt(selectQuestionCount.value);
    settings.useVoice = chkUseVoice.checked;

    // 2. Setup Interview Engine
    window.InterviewEngine.initInterview(userProfile, settings);

    // Update Live UI Labels
    updateInterviewerPanelUI();

    // Clear Chat
    chatHistoryContainer.innerHTML = '';
    
    // 3. Show Loading
    textProcessingTitle.textContent = "AI 면접관이 첫 번째 질문을 설계 중입니다";
    textProcessingDesc.textContent = "제출하신 프로필 키워드를 분석하여 면접 문항을 동적으로 매핑하고 있습니다. 잠시만 대기해 주세요...";
    overlayProcessing.classList.add('active');

    try {
      currentQuestion = await window.InterviewEngine.startInterview();
      overlayProcessing.classList.remove('active');
      
      // Navigate to Interview room
      showView('interview');

      // Add intro & first question
      const introMessage = `안녕하세요! 저는 오늘 면접을 진행하게 된 ${getInterviewerName()}입니다. 제출해주신 이력을 분석하여 준비한 질문들로 면접을 시작하겠습니다.`;
      addChatMessage('bot', introMessage);
      
      setTimeout(() => {
        addChatMessage('bot', currentQuestion);
        speakText(currentQuestion);
      }, 1000);

      updateProgressUI();
    } catch (error) {
      overlayProcessing.classList.remove('active');
      showToast("면접 시작 과정에서 에러가 발생했습니다: " + error.message, "error");
    }
  });

  function getInterviewerName() {
    if (settings.persona === 'strict') return 'AI 압박 면접관 (스파르타)';
    if (settings.persona === 'friendly') return 'AI 친근한 면접관 (체리)';
    return 'AI 실무 기술 면접관 (데브)';
  }

  function updateInterviewerPanelUI() {
    textInterviewerName.textContent = getInterviewerName();
    textVoiceMode.textContent = settings.useVoice ? 'TTS / STT 켜짐' : '음성 오프라인';
    
    if (settings.persona === 'strict') {
      textInterviewerType.textContent = '엄격한 검증 • 일관성 추적';
      avatarIcon.className = 'fa-solid fa-user-ninja';
    } else if (settings.persona === 'friendly') {
      textInterviewerType.textContent = '강점 발굴 • 성장 중심 조언';
      avatarIcon.className = 'fa-solid fa-user-astronaut';
    } else {
      textInterviewerType.textContent = '아키텍처 설계 • 실무 역량 검증';
      avatarIcon.className = 'fa-solid fa-user-tie';
    }
  }

  function updateProgressUI() {
    const currentIdx = window.InterviewEngine.currentQuestionIdx + 1;
    const total = window.InterviewEngine.questionCount;
    textProgressRatio.textContent = `${currentIdx} / ${total}`;
    
    const pct = (currentIdx / total) * 100;
    interviewProgressBar.style.width = `${pct}%`;
  }

  // Speak Again
  btnSpeakAgain.addEventListener('click', () => {
    speakText(currentQuestion);
  });

  // Quit Interview
  btnQuitInterview.addEventListener('click', () => {
    if (confirm("면접을 중단하고 나가시겠습니까? 현재까지의 면접 데이터는 저장되지 않습니다.")) {
      showView('home');
    }
  });

  // STT Microphone Toggle
  btnSttToggle.addEventListener('click', () => {
    if (!recognition) {
      showToast("이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 사용을 권장합니다.", "error");
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  // Textarea word counter
  textareaAnswer.addEventListener('input', updateCharCounter);

  // Submit Answer
  btnSubmitAnswer.addEventListener('click', async () => {
    const answer = textareaAnswer.value.trim();
    if (!answer) {
      showToast("답변을 입력하거나 말씀해 주세요.", "warning");
      return;
    }

    // Stop speaking and recording
    stopSpeaking();
    stopRecording();

    // 1. Add user answer message to chat bubble
    addChatMessage('user', answer);
    textareaAnswer.value = '';
    updateCharCounter();

    // 2. Add loading bubble to chat history
    addLoadingBubble();

    try {
      const response = await window.InterviewEngine.submitAnswer(answer);
      removeLoadingBubble();

      if (response.isFinished) {
        // Go to Evaluation Report
        await finishAndShowReport();
      } else {
        // Keep going
        currentQuestion = response.question;
        addChatMessage('bot', currentQuestion);
        updateProgressUI();
        speakText(currentQuestion);
      }
    } catch (error) {
      removeLoadingBubble();
      showToast("답변 제출 과정에서 오류가 발생했습니다: " + error.message, "error");
    }
  });

  // Generate Report UI
  async function finishAndShowReport() {
    textProcessingTitle.textContent = "AI가 면접 내용을 정밀 분석하고 있습니다";
    textProcessingDesc.textContent = "답변의 전문성, 논리성, 경험 구체성을 종합적으로 분석하여 역량 보고서를 작성 중입니다. 약 5~10초 정도 소요됩니다.";
    overlayProcessing.classList.add('active');

    try {
      const report = await window.InterviewEngine.getFinalReport();
      overlayProcessing.classList.remove('active');

      // Render View Report
      showView('report');

      // Populate Text Feedbacks
      textReportDate.textContent = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
      textReportJob.textContent = userProfile.job;
      textTotalScore.innerHTML = `${report.totalScore}<span class="score-max">/100</span>`;
      
      scoreFit.textContent = `${report.scores.fit}점`;
      scoreExperience.textContent = `${report.scores.experience}점`;
      scoreLogic.textContent = `${report.scores.logic}점`;
      scoreExpert.textContent = `${report.scores.expert}점`;
      scoreDelivery.textContent = `${report.scores.delivery}점`;

      textFeedbackStrengths.textContent = report.strengths;
      textFeedbackWeaknesses.textContent = report.weaknesses;
      textFeedbackImprovements.textContent = report.improvements;

      // Populate Q&A List
      qaDetailsContainer.innerHTML = '';
      report.qaFeedback.forEach((item, idx) => {
        const qaItem = document.createElement('div');
        qaItem.className = 'qa-item card';
        qaItem.innerHTML = `
          <div class="qa-q">
            <span class="badge badge-teal">질문 ${idx + 1}</span>
            <p class="font-semibold text-lg">${item.question}</p>
          </div>
          <div class="qa-a">
            <span class="badge badge-secondary">제출한 답변</span>
            <p class="text-gray-600 leading-relaxed">${item.answer}</p>
          </div>
          <div class="qa-feedback mt-4">
            <div class="feedback-sub-title text-teal">
              <i class="fa-solid fa-wand-magic-sparkles"></i> AI 추천 모범 답변
            </div>
            <p class="recommendation-text leading-relaxed text-sm text-gray-700 bg-teal-soft p-4 rounded">
              ${item.recommendation}
            </p>
          </div>
        `;
        qaDetailsContainer.appendChild(qaItem);
      });

      // Draw Radar Chart
      const scoreValues = [
        report.scores.fit,
        report.scores.experience,
        report.scores.logic,
        report.scores.expert,
        report.scores.delivery
      ];
      drawRadarChart(scoreValues);

      showToast("면접 결과 보고서가 생성되었습니다!", "success");
    } catch (error) {
      overlayProcessing.classList.remove('active');
      showToast("보고서 생성 중 오류가 발생했습니다: " + error.message, "error");
    }
  }

  // --- Radar Chart Drawing with Chart.js ---
  function drawRadarChart(scores) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Grid and label colors based on theme
    const gridColor = isDark ? '#475569' : '#cbd5e1';
    const angleColor = isDark ? '#94a3b8' : '#64748b';
    const labelColor = isDark ? '#f8fafc' : '#0f172a';

    if (radarChartInstance) {
      radarChartInstance.destroy();
    }

    radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['직무 적합도', '경험 구체성', '논리적 구성', '직무 전문성', '태도 및 표현'],
        datasets: [{
          label: '내 면접 역량',
          data: scores,
          backgroundColor: isDark ? 'rgba(20, 184, 166, 0.25)' : 'rgba(15, 118, 110, 0.2)',
          borderColor: isDark ? '#14b8a6' : '#0f766e',
          borderWidth: 2,
          pointBackgroundColor: isDark ? '#14b8a6' : '#0f766e',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: isDark ? '#14b8a6' : '#0f766e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            angleLines: {
              color: gridColor
            },
            grid: {
              color: gridColor
            },
            pointLabels: {
              color: labelColor,
              font: {
                family: 'Inter, Noto Sans KR',
                size: 12,
                weight: 'bold'
              }
            },
            ticks: {
              backdropColor: 'transparent',
              color: angleColor,
              font: {
                size: 9
              },
              stepSize: 20
            },
            suggestedMin: 50,
            suggestedMax: 100
          }
        }
      }
    });
  }

  // Print Report (PDF Save)
  btnPrintReport.addEventListener('click', () => {
    window.print();
  });

  // Restart Interview
  btnRestart.addEventListener('click', () => {
    showView('onboarding');
  });

  // Handle mobile voices list loading delay
  if (synth) {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }
});
