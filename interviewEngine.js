/* interviewEngine.js - AI & Local Simulation Engine for My AI Interviewer */

const LOCAL_QUESTION_DATABASE = {
  developer: [
    {
      id: 1,
      question: "지원하신 직무에 관련된 프로젝트 중 가장 몰입했던 경험과, 그 프로젝트에서 본인이 담당한 핵심 기술적 기여는 무엇인가요?",
      strengths: "담당하신 기능과 사용한 기술 스택에 대해 일관되게 핵심 기여를 설명하셨습니다. 기술 선정의 근거를 말한 점이 우수합니다.",
      weaknesses: "비동기 데이터 흐름이나 에러 대응 시의 기술적 한계 또는 트레이드오프(Trade-off)가 다소 단순하게 기술되었습니다.",
      improvements: "사용한 특정 라이브러리(예: Redux, React Query 등)의 도입 배경과, 기존 방식 대비 생산성이나 렌더링 성능이 어떻게 개선되었는지 수치화하여 보완해 보세요.",
      recommendation: "저는 [프로젝트명] 프로젝트에서 [담당 역할]을 맡았습니다. 이 과정에서 발생한 데이터 병목현상을 해결하기 위해 [구체적인 기술]을 적극 도입했습니다. 구체적으로는 컴포넌트 렌더링 횟수를 기존 대비 30% 감소시켰으며, 전역 상태와 캐싱 관리를 활용해 불필요한 네트워크 요청을 방지했습니다. 이러한 시도는 단순 기능 구현을 넘어 아키텍처 관점에서의 문제를 주도적으로 진단하고 해결한 경험이었습니다."
    },
    {
      id: 2,
      question: "프로젝트 진행 과정에서 팀 내 의견 조율이 필요했거나 기술적인 갈등(의견 차이)이 발생했을 때, 이를 해결한 구체적인 사례를 말씀해 주세요.",
      strengths: "협업 과정에서 적극적인 소통과 논리적 설득 과정을 성실하게 서술하였습니다.",
      weaknesses: "갈등의 원인을 객관적으로 분석하기보다는 상황 정리와 타협에 치중한 답변으로 보일 수 있습니다.",
      improvements: "서로 다른 기술적 주장의 장단점을 정량적으로 비교 분석하는 데이터 중심의 설득 과정을 드러내면 논리적 전문성이 더해집니다.",
      recommendation: "협업 시 아키텍처 결정을 두고 이견이 생겼을 때, 감정적 조율보다는 객관적인 벤치마크 데이터를 준비하여 팀원들을 설득했습니다. 구체적인 처리 속도 및 코드 가독성 비교표를 제시함으로써 합리적인 기술 의사결정을 도출했습니다. 이는 협업에서 논리적 근거가 왜 중요한지 깨닫는 계기였습니다."
    },
    {
      id: 3,
      question: "개발 중 발생했던 가장 까다로운 버그나 시스템 트래픽 등의 성능 병목 현상이 무엇이었고, 이를 어떻게 분석하여 해결하셨습니까?",
      strengths: "트러블슈팅 과정을 현상 확인, 원인 추적, 해결책 적용의 흐름으로 상세히 설명하셨습니다.",
      weaknesses: "성능이나 버그 수정 이후의 개선 결과가 정량적인 수치(응답 속도, 번들 크기 감소량 등)로 드러나지 않은 점이 다소 아쉽습니다.",
      improvements: "디버깅 시 사용한 도구(예: Chrome DevTools Performance 탭, 메모리 프로파일러)와 최종 개선 성과를 객관적 숫자로 정리하여 답변해 보세요.",
      recommendation: "서비스 테스트 중 [원인]으로 인해 페이지 로딩 속도가 3초 이상 지연되는 현상을 확인했습니다. 이를 해결하고자 DevTools를 활용해 CPU 프로파일링과 네트워크 폭포수 차트를 분석했고, 중복 렌더링을 유발하는 코드를 식별했습니다. [해결 조치]를 취한 결과, 로딩 속도를 1.2초로 60% 단축시켰으며 자원 소모량도 약 20% 절감할 수 있었습니다."
    },
    {
      id: 4,
      question: "신기술 도입이나 새로운 라이브러리/프레임워크를 학습하고 적용하는 본인만의 학습 프로세스와 노하우가 있다면 말씀해 주세요.",
      strengths: "주도적인 학습 의지와 실제 적용을 통한 실무적 역량 증명을 잘 드러내 주셨습니다.",
      weaknesses: "학습한 기술을 실제 프로젝트의 리스크 관리와 어떻게 결합하는지에 대한 고려가 약하게 표현되었습니다.",
      improvements: "기술의 트렌디함에 집중하기보다 서비스의 안정성과 확장성에 기여하는 방향으로 신기술 검토 프로세스를 구체화하십시오.",
      recommendation: "저는 공식 문서의 'Concepts' 리딩을 시작으로 공식 가이드라인을 엄격히 숙지한 후, 작은 토이 프로젝트를 만들어 강도 높은 검증을 진행합니다. 단순히 코드를 복사하는 것이 아니라 내부 동작 원리를 이해하고, 팀원들에게 공유 세션을 열어 협업 전체의 수준을 끌어올리는 주도적 성향을 지니고 있습니다."
    },
    {
      id: 5,
      question: "품질 높은 소프트웨어를 작성하기 위해 코드 가독성, 아키텍처 설계, 혹은 테스트 코드 작성 중 가장 중요하게 생각하는 가치는 무엇인가요?",
      strengths: "자신만의 소프트웨어 개발 철학을 일관성 있게 전달하셨습니다.",
      weaknesses: "선택한 가치 외의 다른 중요한 요소들에 대한 균형 잡힌 고려가 살짝 부족해 보일 수 있습니다.",
      improvements: "특정 원칙을 고수함과 동시에, 팀의 전체 개발 속도와 코드 품질 사이의 유연한 조화를 고려하고 있음을 강조하세요.",
      recommendation: "저는 지속 가능한 개발을 위해 '유지보수 가능한 아키텍처와 가독성'을 최우선으로 꼽습니다. 아무리 훌륭한 기능이라도 동료가 이해할 수 없고 리팩토링이 불가능하다면 부채가 되기 때문입니다. 일관된 코드 컨벤션을 준수하고, 인터페이스를 명확히 분리하여 미래의 유지보수 비용을 최소화하는 신뢰할 수 있는 개발자가 되는 것이 제 지향점입니다."
    }
  ],
  generic: [
    {
      id: 1,
      question: "본인의 주요 관심 직무에 지원하게 된 동기와, 이를 위해 준비해 온 가장 핵심적인 역량은 무엇입니까?",
      strengths: "직무에 대한 관심이 일시적이지 않고 꾸준히 쌓아온 준비 과정이 잘 표현되었습니다.",
      weaknesses: "타 지원자들과 차별화되는 본인만의 고유한 무기나 필살기적인 경험이 덜 강조되었습니다.",
      improvements: "이 직무에 적합한 구체적인 실무 경험이나 성과를 서론에 배치하여 두괄식으로 자신감을 표현해 보세요.",
      recommendation: "제가 이 직무를 꿈꾸게 된 이유는 실질적인 문제를 창의적으로 해결하는 데 깊은 매력을 느꼈기 때문입니다. 저는 이를 위해 [전공/자격증] 등 기본 이론 지식을 습득하고, 나아가 실제 [프로젝트/활동]을 주도적으로 진행하며 실무 감각을 익혔습니다. 이러한 준비는 단순 지식을 넘어 실행력 있는 실무자로 성장하는 굳건한 토대가 되었습니다."
    },
    {
      id: 2,
      question: "인생에서 가장 도전적인 목표를 세우고 이를 달성하기 위해 끈기 있게 노력했던 경험에 대해 소개해 주세요.",
      strengths: "한계에 부딪혔을 때 포기하지 않고 끝까지 완수한 극복 의지가 돋보입니다.",
      weaknesses: "극복하는 과정에서 본인의 구체적인 액션보다 외부 환경의 변화에 기대어 서술된 느낌이 듭니다.",
      improvements: "장애물이 발생했을 때 본인이 주도한 대안 수립 과정 및 의사결정을 자세히 구사하십시오.",
      recommendation: "이전에는 다루어보지 못했던 고난도의 과제를 해결해야 했을 때, 매일 2시간씩 추가 자료를 리서치하고 전문가 채널을 통해 자문을 얻으며 해결책을 끈질기게 모색했습니다. 결과적으로 당초 목표했던 결과를 120% 초과 달성할 수 있었으며, 이는 포기하지 않는 몰입이 혁신적인 성과를 낳는다는 것을 체득한 값진 경험이었습니다."
    },
    {
      id: 3,
      question: "공동의 목표를 달성하는 과정에서 협업을 통해 시너지를 내거나 갈등을 원만하게 해결한 경험은 무엇인가요?",
      strengths: "개인의 독주보다 팀워크와 소통을 존중하는 윤리적 자세가 돋보입니다.",
      weaknesses: "역할 분담과 태도 조율 측면에만 머물러, 실제 성과 창출 과정에서의 실무적 소통이 약하게 보입니다.",
      improvements: "서로 다른 이해관계를 조정하기 위해 사용한 경청의 기법과 조율한 시스템을 명시해 보세요.",
      recommendation: "팀원 간 의견 대립이 있었을 때, 서로의 의견을 경청한 뒤 각 제안의 리스크와 메리트를 시각적으로 구조화하여 투명하게 공유했습니다. 이 조율을 통해 공동의 타협안을 마련할 수 있었고, 최종 결과물의 완성도를 크게 향상할 수 있었습니다. 타인의 관점을 포용하는 유연한 소통이야말로 진정한 협업의 기초임을 배웠습니다."
    },
    {
      id: 4,
      question: "빠르게 변하는 업무 환경이나 새로운 요구 사항을 마주했을 때, 이를 민첩하게 수용하고 해결책을 찾아낸 사례가 있나요?",
      strengths: "적응력과 상황 변화에 대한 유연한 태도가 잘 강조되었습니다.",
      weaknesses: "갑작스러운 변경 속에서 겪었던 시행착오나 불안정을 처리한 방식의 서술이 부족합니다.",
      improvements: "불확실한 상황에서도 침착함을 유지하기 위한 자신만의 멘탈 모델이나 리소스를 적극 공유해 주십시오.",
      recommendation: "프로젝트 도중 갑작스럽게 요구 사양이 수정되었을 때, 당황하지 않고 전체 요구사항 리스트의 우선순위를 재조정했습니다. 변경 사항을 조기에 식별하고, 가장 핵심적인 MVP 기능을 먼저 타격함으로써 일정을 준수했습니다. 이는 변화를 위기가 아닌 성장의 기회로 전환하는 민첩함을 체득한 계기였습니다."
    },
    {
      id: 5,
      question: "우리 회사에 입사하게 된다면, 3년 혹은 5년 후에 이 직무에서 어떤 전문가로 성장하고 싶으신지 포부를 말씀해 주세요.",
      strengths: "회사와 직무에 대한 장기적 커리어 플랜을 적극적으로 설계하고 있습니다.",
      weaknesses: "제시한 커리어 로드맵이 회사 비즈니스와 다소 분리되어 개인 학습 계획처럼 보일 위험이 있습니다.",
      improvements: "본인의 성장이 기업의 실질적인 비즈니스 가치 창출과 어떻게 연결되는지 연계점을 구체화하십시오.",
      recommendation: "입사 후 초기에는 조직의 핵심 업무 프로세스를 신속하게 마스터하여 신뢰받는 실무진이 되겠습니다. 3년 뒤에는 주도적인 프로젝트 리딩 경험을 쌓아 팀의 생산성을 극대화하는 중추적인 멤버로 성장하고, 5년 뒤에는 시장 변화를 예측하고 선제적 성과를 이끄는 당사 직무 분야의 대체 불가능한 핵심 인재로 거듭나겠습니다."
    }
  ]
};

class InterviewEngine {
  constructor() {
    this.apiKey = localStorage.getItem('gemini_api_key') || '';
    this.userProfile = null;
    this.history = []; // Conversation history for Gemini
    this.questionCount = 5;
    this.currentQuestionIdx = 0;
    this.questions = [];
    this.answers = [];
    this.persona = 'professional';
  }

  setApiKey(key) {
    this.apiKey = key;
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }

  hasValidApiKey() {
    return this.apiKey && this.apiKey.trim().startsWith('AIzaSy');
  }

  initInterview(profile, settings) {
    this.userProfile = profile;
    this.questionCount = parseInt(settings.questionCount) || 5;
    this.persona = settings.persona || 'professional';
    this.currentQuestionIdx = 0;
    this.history = [];
    this.questions = [];
    this.answers = [];
  }

  // Generate Questions (Initial & Setup)
  async startInterview() {
    if (this.hasValidApiKey()) {
      try {
        return await this.generateFirstQuestionWithGemini();
      } catch (error) {
        console.error("Gemini API Error, falling back to local engine:", error);
        return this.startLocalInterview();
      }
    } else {
      return this.startLocalInterview();
    }
  }

  // Submit Answer & Get Next Question
  async submitAnswer(answer) {
    this.answers.push(answer);
    this.currentQuestionIdx++;

    if (this.currentQuestionIdx >= this.questionCount) {
      // Completed!
      return { isFinished: true };
    }

    if (this.hasValidApiKey()) {
      try {
        const nextQ = await this.generateNextQuestionWithGemini(answer);
        return { isFinished: false, question: nextQ };
      } catch (error) {
        console.error("Gemini API Error during follow-up, falling back to local:", error);
        // Fallback next question
        const nextQ = this.getLocalQuestion(this.currentQuestionIdx);
        this.questions.push(nextQ);
        return { isFinished: false, question: nextQ };
      }
    } else {
      const nextQ = this.getLocalQuestion(this.currentQuestionIdx);
      this.questions.push(nextQ);
      return { isFinished: false, question: nextQ };
    }
  }

  // Get final report
  async getFinalReport() {
    if (this.hasValidApiKey()) {
      try {
        return await this.generateReportWithGemini();
      } catch (error) {
        console.error("Gemini Report Error, falling back to local engine:", error);
        return this.generateLocalReport();
      }
    } else {
      return this.generateLocalReport();
    }
  }

  /* ==========================================================================
     LOCAL SIMULATION ENGINE (API KEY가 없을 때 동작)
     ========================================================================== */

  startLocalInterview() {
    // Determine pool (developer or generic)
    const isTechJob = this.isTechnicalJob(this.userProfile.job) || this.isTechnicalJob(this.userProfile.major);
    const pool = isTechJob ? LOCAL_QUESTION_DATABASE.developer : LOCAL_QUESTION_DATABASE.generic;
    
    // Select N questions from pool
    const selected = [];
    for (let i = 0; i < this.questionCount; i++) {
      selected.push(pool[i % pool.length].question);
    }
    
    this.questions = selected;
    return this.questions[0];
  }

  getLocalQuestion(index) {
    const isTechJob = this.isTechnicalJob(this.userProfile.job) || this.isTechnicalJob(this.userProfile.major);
    const pool = isTechJob ? LOCAL_QUESTION_DATABASE.developer : LOCAL_QUESTION_DATABASE.generic;
    return pool[index % pool.length].question;
  }

  isTechnicalJob(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return lower.includes('개발') || lower.includes('컴퓨터') || lower.includes('소프트웨어') || 
           lower.includes('웹') || lower.includes('앱') || lower.includes('프론트') || 
           lower.includes('백엔드') || lower.includes('엔지니어') || lower.includes('데이터') ||
           lower.includes('ai') || lower.includes('tech') || lower.includes('ict') || lower.includes('coding');
  }

  generateLocalReport() {
    const isTechJob = this.isTechnicalJob(this.userProfile.job) || this.isTechnicalJob(this.userProfile.major);
    const pool = isTechJob ? LOCAL_QUESTION_DATABASE.developer : LOCAL_QUESTION_DATABASE.generic;
    
    // Generate scores based on answer characteristics (simulated)
    const averageLength = this.answers.reduce((acc, val) => acc + (val ? val.length : 0), 0) / this.answers.length;
    
    // Core scores logic based on answer length & keywords
    let lengthBonus = Math.min(15, Math.floor(averageLength / 10)); // max 15 points
    let fitScore = 75 + lengthBonus + Math.floor(Math.random() * 8);
    let experienceScore = 70 + lengthBonus + Math.floor(Math.random() * 12);
    let logicScore = 72 + lengthBonus + Math.floor(Math.random() * 10);
    let expertScore = 74 + lengthBonus + Math.floor(Math.random() * 8);
    let deliveryScore = 78 + lengthBonus + Math.floor(Math.random() * 6);

    // Caps
    fitScore = Math.min(98, fitScore);
    experienceScore = Math.min(98, experienceScore);
    logicScore = Math.min(98, logicScore);
    expertScore = Math.min(98, expertScore);
    deliveryScore = Math.min(98, deliveryScore);

    const totalScore = Math.round((fitScore + experienceScore + logicScore + expertScore + deliveryScore) / 5);

    // Compile dynamic Q&A Feedback list
    const qaFeedback = this.questions.map((q, idx) => {
      const originalItem = pool.find(item => item.question === q) || pool[idx % pool.length];
      return {
        question: q,
        answer: this.answers[idx] || "답변을 입력하지 않았거나 스킵하셨습니다.",
        recommendation: originalItem.recommendation
      };
    });

    // General feedbacks based on persona
    let strengths = "";
    let weaknesses = "";
    let improvements = "";

    if (this.persona === 'strict') {
      strengths = "어려운 질문 구조 속에서도 자기소개서의 핵심 프로젝트를 주도적으로 설명하려고 시도한 논리적 전달력이 우수합니다.";
      weaknesses = "답변의 구성이 때로 결론부터 제시되지 않아 지연되는 느낌을 주며, 질문의 핵심 의도(트러블슈팅/구체성)를 피해 가는 듯한 인상을 줄 수 있습니다.";
      improvements = "두괄식 답변 태도를 강화하십시오. 또한, '열심히 했다'는 서술 대신 '몇 퍼센트 개선했다'와 같은 정량적 성과 지표(KPI)를 즉각 제시하는 훈련을 권장합니다.";
    } else if (this.persona === 'friendly') {
      strengths = "자신의 열정과 전공 공부 및 프로젝트 협업 과정을 친근하고 진솔하게 서술하여 친화력과 협업성에서 매우 높은 점수를 획득하였습니다.";
      weaknesses = "자신의 구체적인 기술적 기여도나 문제 해결 수치가 겸손하게 표현되어, 핵심 전문 역량이 다소 묻히는 경향이 있습니다.";
      improvements = "협업에서 본인이 주도한 역할에 방점을 찍어 자신 있게 설명하십시오. 본인의 기여도를 수치상으로 분리해 전달하는 화법을 연습해 보세요.";
    } else { // professional
      strengths = "자신의 전공과 실무 프로젝트를 연계하여 비동기 처리, 툴킷 활용 등 핵심 프레임워크의 도입 근거를 조리 있게 서술한 전문성이 훌륭합니다.";
      weaknesses = "대체로 기술 구현에만 서술이 쏠려 있어, 비즈니스 가치 기여나 사용자 피드백을 기반으로 한 지속적인 서비스 개선 경험은 부족해 보입니다.";
      improvements = "본인의 기술적 의사결정이 사용자 지표에 어떤 영향을 미쳤는지, 혹은 팀의 개발 생산성을 얼마나 향상시켰는지 확장해서 답변하는 능력을 함양하십시오.";
    }

    return {
      scores: {
        fit: fitScore,
        experience: experienceScore,
        logic: logicScore,
        expert: expertScore,
        delivery: deliveryScore
      },
      totalScore: totalScore,
      strengths: strengths,
      weaknesses: weaknesses,
      improvements: improvements,
      qaFeedback: qaFeedback
    };
  }

  /* ==========================================================================
     GEMINI API CONNECTION (API KEY가 있을 때 동작)
     ========================================================================== */

  getSystemPrompt() {
    let personaPrompt = "";
    switch (this.persona) {
      case 'strict':
        personaPrompt = "당신은 극도로 깐깐하고 날카로운 '압박 면접관'입니다. 답변의 모순을 날카롭게 지적하고, 정량적인 수치나 구체적인 조치에 대해 집요한 꼬리 질문(Follow-up)을 던지는 성향입니다. 칭찬을 아끼고 논리적 결점을 파고드세요.";
        break;
      case 'friendly':
        personaPrompt = "당신은 부드럽고 따뜻한 '격려형 면접관'입니다. 면접자의 긴장을 풀어주고 강점을 적극적으로 발굴하며, 미흡한 답변에도 힌트를 주거나 공감해 주면서 다음 꼬리 질문을 부드럽게 이어가는 성향입니다.";
        break;
      case 'professional':
      default:
        personaPrompt = "당신은 이성적이고 차분한 '실무형 기술 면접관'입니다. 트렌디한 기술보다 근본적인 동작 원리와 아키텍처 의사결정 이유를 깊이 있게 파고듭니다. 실무 상황에 적용 가능한 해결책을 가졌는지 검증합니다.";
        break;
    }

    return `
      당신은 채용 플랫폼에서 제공하는 모의 면접 서비스의 전문 AI 면접관입니다.
      아래 제공되는 면접자의 프로필을 바탕으로 직무 면접을 진행합니다.
      
      [면접관 성향]
      ${personaPrompt}

      [면접자 정보]
      - 전공: ${this.userProfile.major}
      - 지원 직무: ${this.userProfile.job}
      - 프로젝트 경험: ${this.userProfile.projects}
      - 자기소개: ${this.userProfile.intro || '없음'}

      [규칙]
      1. 총 ${this.questionCount}개의 질문을 순서대로 진행합니다.
      2. 한국어로 자연스럽고 신뢰감 있는 면접관 어조를 구사하십시오.
      3. 첫 번째 질문은 면접자의 프로젝트 경험 혹은 전공 지식에 기반하여, 흥미롭고 구체적인 개시 질문을 던져야 합니다.
      4. 두 번째 질문부터는 면접자가 방금 답변한 내용에서 논리적 결점, 기술적 궁금증, 혹은 추가 설명이 필요한 부분을 정확하게 집어내어 '꼬리 질문(Follow-up Question)' 형태로 던지십시오.
      5. 질문은 항상 하나씩만 던지십시오. 여러 개를 나열해서 묻지 마십시오.
      6. 친근하게 인사한 후, 바로 첫 번째 질문을 제공하세요.
    `;
  }

  async callGeminiAPI(messages, sysInstruction = "", forceJson = false) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
    
    // Map history to Gemini API contents format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: forceJson ? 0.3 : 0.7,
      }
    };

    if (sysInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: sysInstruction }]
      };
    }

    if (forceJson) {
      requestBody.generationConfig.responseMimeType = "application/json";
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Gemini API 호출 실패");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async generateFirstQuestionWithGemini() {
    const systemPrompt = this.getSystemPrompt();
    const chatMsg = [
      { role: 'user', content: "면접을 시작하겠습니다. 첫 번째 질문을 던져주세요." }
    ];

    const responseText = await this.callGeminiAPI(chatMsg, systemPrompt);
    this.history.push({ role: 'user', content: "면접을 시작하겠습니다. 첫 번째 질문을 던져주세요." });
    this.history.push({ role: 'assistant', content: responseText });
    this.questions.push(responseText);

    return responseText;
  }

  async generateNextQuestionWithGemini(userAnswer) {
    const systemPrompt = this.getSystemPrompt();
    
    // Push user answer
    this.history.push({ role: 'user', content: userAnswer });

    // Request next question (which is a follow-up)
    const prompt = `앞의 답변에 대한 꼬리 질문을 던져 주십시오. 현재 진행 상황은 전체 ${this.questionCount}개 질문 중 ${this.currentQuestionIdx + 1}번째 질문을 출제할 차례입니다.`;
    
    const tempMessages = [...this.history, { role: 'user', content: prompt }];
    const responseText = await this.callGeminiAPI(tempMessages, systemPrompt);
    
    // Save to history & questions list
    this.history.push({ role: 'assistant', content: responseText });
    this.questions.push(responseText);

    return responseText;
  }

  async generateReportWithGemini() {
    const sysInstruction = `
      당신은 수십만 건의 대화 로그를 채점한 베테랑 IT 기술 인사팀장 및 직무 코치입니다.
      제시된 질문과 답변 리스트를 종합 분석하여 공정하고 객관적인 5차원 역량 평가서 및 상세 피드백을 JSON 형식으로 작성해 주십시오.

      [출력 JSON 스펙]
      반드시 다음 키들을 지닌 JSON 구조체여야 합니다:
      {
        "scores": {
          "fit": 70~100 사이의 정수 (직무 적합도),
          "experience": 70~100 사이의 정수 (경험 구체성),
          "logic": 70~100 사이의 정수 (논리적 구성),
          "expert": 70~100 사이의 정수 (직무 전문성),
          "delivery": 70~100 사이의 정수 (태도 및 표현)
        },
        "totalScore": 위 5개 점수의 산술 평균 (정수),
        "strengths": "면접자가 보여준 강점과 우수한 점에 대한 총평 (4~5줄의 자연스러운 한국어 문장)",
        "weaknesses": "면접자가 보완해야 하거나 답변에서 부족했던 논리적 결점, 구체성 결여에 대한 피드백 (4~5줄의 자연스러운 한국어 문장)",
        "improvements": "향후 모의고사를 대비하기 위해 면접자가 고치고 공부해야 할 방향과 태도, 구성 팁 (4~5줄의 자연스러운 한국어 문장)",
        "qaFeedback": [
          {
            "question": "실제 질문 내용",
            "answer": "면접자가 대답한 내용",
            "recommendation": "이 질문에 대한 핵심 키워드와 핵심 아키텍처가 결합한 3~4줄 분량의 모범 모법 추천 답변 예시"
          },
          ... (모든 문항에 대해 동일하게 작성)
        ]
      }
    `;

    // Format chat logs to a compact prompt
    let conversationText = `면접자 전공: ${this.userProfile.major}\n지원 직무: ${this.userProfile.job}\n프로젝트 경험: ${this.userProfile.projects}\n자기소개: ${this.userProfile.intro || '없음'}\n\n`;
    conversationText += "--- 면접 대화록 ---\n";
    this.questions.forEach((q, idx) => {
      conversationText += `[질문 ${idx+1}] ${q}\n`;
      conversationText += `[답변 ${idx+1}] ${this.answers[idx] || '대답 없음'}\n\n`;
    });

    const messages = [
      { role: 'user', content: `아래 대화록을 바탕으로 종합 평가 JSON 리포트를 작성해 주세요.\n\n${conversationText}` }
    ];

    const jsonText = await this.callGeminiAPI(messages, sysInstruction, true);
    
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      console.error("JSON 파싱 에러. 원본 텍스트:", jsonText);
      // Fallback parser in case gemini outputs markdown wrapped json
      const cleaned = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    }
  }
}

window.InterviewEngine = new InterviewEngine();
