/* script.js - Core Logic & Hybrid AI Engine for My AI Interviewer */

/* ==========================================================================
   PART 1: INTERVIEW ENGINE (Gemini API & Local Simulator)
   ========================================================================== */

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
      strengths: "트러버슈팅 과정을 현상 확인, 원인 추적, 해결책 적용의 흐름으로 상세히 설명하셨습니다.",
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
    this.history = []; 
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

  async submitAnswer(answer) {
    this.answers.push(answer);
    this.currentQuestionIdx++;

    if (this.currentQuestionIdx >= this.questionCount) {
      return { isFinished: true };
    }

    if (this.hasValidApiKey()) {
      try {
        const nextQ = await this.generateNextQuestionWithGemini(answer);
        return { isFinished: false, question: nextQ };
      } catch (error) {
        console.error("Gemini API Error during follow-up, falling back to local:", error);
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

  startLocalInterview() {
    const isTechJob = this.isTechnicalJob(this.userProfile.job) || this.isTechnicalJob(this.userProfile.major);
    const pool = isTechJob ? LOCAL_QUESTION_DATABASE.developer : LOCAL_QUESTION_DATABASE.generic;
    
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
    
    const averageLength = this.answers.reduce((acc, val) => acc + (val ? val.length : 0), 0) / this.answers.length;
    
    let lengthBonus = Math.min(15, Math.floor(averageLength / 10)); 
    let fitScore = 75 + lengthBonus + Math.floor(Math.random() * 8);
    let experienceScore = 70 + lengthBonus + Math.floor(Math.random() * 12);
    let logicScore = 72 + lengthBonus + Math.floor(Math.random() * 10);
    let expertScore = 74 + lengthBonus + Math.floor(Math.random() * 8);
    let deliveryScore = 78 + lengthBonus + Math.floor(Math.random() * 6);

    fitScore = Math.min(98, fitScore);
    experienceScore = Math.min(98, experienceScore);
    logicScore = Math.min(98, logicScore);
    expertScore = Math.min(98, expertScore);
    deliveryScore = Math.min(98, deliveryScore);

    const totalScore = Math.round((fitScore + experienceScore + logicScore + expertScore + deliveryScore) / 5);

    const qaFeedback = this.questions.map((q, idx) => {
      const originalItem = pool.find(item => item.question === q) || pool[idx % pool.length];
      return {
        question: q,
        answer: this.answers[idx] || "답변을 입력하지 않았거나 스킵하셨습니다.",
        recommendation: originalItem.recommendation
      };
    });

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
    } else { 
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
    this.history.push({ role: 'user', content: userAnswer });

    const prompt = `앞의 답변에 대한 꼬리 질문을 던져 주십시오. 현재 진행 상황은 전체 ${this.questionCount}개 질문 중 ${this.currentQuestionIdx + 1}번째 질문을 출제할 차례입니다.`;
    
    const tempMessages = [...this.history, { role: 'user', content: prompt }];
    const responseText = await this.callGeminiAPI(tempMessages, systemPrompt);
    
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
            "recommendation": "이 질문에 대한 핵심 키워드와 핵심 아키텍처가 결합한 3~4줄 분량의 모범 추천 답변 예시"
          },
          ...
        ]
      }
    `;

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
      const cleaned = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    }
  }
}

window.InterviewEngine = new InterviewEngine();


/* ==========================================================================
   PART 2: APPLICATION CONTROLLER (UI Router, Web Speech, DOM Bindings)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let userProfile = { major: '', job: '', projects: '', intro: '' };
  let settings = { persona: 'professional', questionCount: 5, useVoice: true };
  let currentQuestion = '';
  let isRecording = false;
  let recognition = null;
  let synth = window.speechSynthesis;
  let currentUtterance = null;
  let radarChartInstance = null;

  // UI Elements
  const views = {
    home: document.getElementById('view-home'),
    onboarding: document.getElementById('view-onboarding'),
    lobby: document.getElementById('view-lobby'),
    interview: document.getElementById('view-interview'),
    report: document.getElementById('view-report')
  };

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

  const modalApi = document.getElementById('modal-api');
  const overlayProcessing = document.getElementById('overlay-processing');
  const textProcessingTitle = document.getElementById('text-processing-title');
  const textProcessingDesc = document.getElementById('text-processing-desc');

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

  // Init App
  initApp();

  function initApp() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      btnThemeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      inputApiKey.value = savedKey;
      window.InterviewEngine.setApiKey(savedKey);
    }
    updateLobbyApiStatus();

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

    // Persona Options Radio Styling Highlight
    const personaRadios = document.querySelectorAll('input[name="persona"]');
    personaRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.persona-option').forEach(opt => {
          opt.classList.remove('active');
        });
        radio.closest('.persona-option').classList.add('active');
      });
    });

    initSpeechRecognition();
  }

  function showView(viewId) {
    stopSpeaking();
    stopRecording();
    
    Object.keys(views).forEach(key => {
      if (key === viewId) {
        views[key].classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        views[key].classList.remove('active');
      }
    });
  }

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

    setTimeout(() => {
      toast.style.animation = 'toast-slide-in 0.3s reverse forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 3500);
  }

  // TTS
  function speakText(text) {
    if (!settings.useVoice || !synth) return;
    stopSpeaking();

    currentUtterance = new SpeechSynthesisUtterance(text);
    
    const voices = synth.getVoices();
    const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.startsWith('ko-KR'));
    if (koVoice) {
      currentUtterance.voice = koVoice;
    }
    
    if (settings.persona === 'strict') {
      currentUtterance.rate = 1.05;
      currentUtterance.pitch = 0.9;
    } else if (settings.persona === 'friendly') {
      currentUtterance.rate = 0.95;
      currentUtterance.pitch = 1.1;
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

  // STT
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

  // Chat Bubbles
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

  // Event Bindings
  btnHomeLogo.addEventListener('click', () => {
    if (views.interview.classList.contains('active')) {
      if (confirm("면접이 진행 중입니다. 정말로 중단하고 홈으로 이동하시겠습니까?")) {
        showView('home');
      }
    } else {
      showView('home');
    }
  });

  btnStartApp.addEventListener('click', () => {
    showView('onboarding');
  });

  btnThemeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    if (isDark) {
      btnThemeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      btnThemeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('theme', 'light');
    }
    if (views.report.classList.contains('active') && radarChartInstance) {
      drawRadarChart(radarChartInstance.data.datasets[0].data);
    }
  });

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

  formProfile.addEventListener('submit', (e) => {
    e.preventDefault();
    userProfile.major = inputMajor.value.trim();
    userProfile.job = inputJob.value.trim();
    userProfile.projects = inputProjects.value.trim();
    userProfile.intro = inputIntro.value.trim();

    localStorage.setItem('user_profile_cache', JSON.stringify(userProfile));
    showView('lobby');
  });

  btnBackToOnboarding.addEventListener('click', () => {
    showView('onboarding');
  });

  btnBackHomeList.forEach(btn => {
    btn.addEventListener('click', () => {
      showView('home');
    });
  });

  btnStartInterview.addEventListener('click', async () => {
    const selectedPersona = document.querySelector('input[name="persona"]:checked').value;
    settings.persona = selectedPersona;
    settings.questionCount = parseInt(selectQuestionCount.value);
    settings.useVoice = chkUseVoice.checked;

    window.InterviewEngine.initInterview(userProfile, settings);
    updateInterviewerPanelUI();

    chatHistoryContainer.innerHTML = '';
    
    textProcessingTitle.textContent = "AI 면접관이 첫 번째 질문을 설계 중입니다";
    textProcessingDesc.textContent = "제출하신 프로필 키워드를 분석하여 면접 문항을 동적으로 매핑하고 있습니다. 잠시만 대기해 주세요...";
    overlayProcessing.classList.add('active');

    try {
      currentQuestion = await window.InterviewEngine.startInterview();
      overlayProcessing.classList.remove('active');
      showView('interview');

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

  btnSpeakAgain.addEventListener('click', () => {
    speakText(currentQuestion);
  });

  btnQuitInterview.addEventListener('click', () => {
    if (confirm("면접을 중단하고 나가시겠습니까? 현재까지의 면접 데이터는 저장되지 않습니다.")) {
      showView('home');
    }
  });

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

  textareaAnswer.addEventListener('input', updateCharCounter);

  btnSubmitAnswer.addEventListener('click', async () => {
    const answer = textareaAnswer.value.trim();
    if (!answer) {
      showToast("답변을 입력하거나 말씀해 주세요.", "warning");
      return;
    }

    stopSpeaking();
    stopRecording();

    addChatMessage('user', answer);
    textareaAnswer.value = '';
    updateCharCounter();

    addLoadingBubble();

    try {
      const response = await window.InterviewEngine.submitAnswer(answer);
      removeLoadingBubble();

      if (response.isFinished) {
        await finishAndShowReport();
      } else {
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

  async function finishAndShowReport() {
    textProcessingTitle.textContent = "AI가 면접 내용을 정밀 분석하고 있습니다";
    textProcessingDesc.textContent = "답변의 전문성, 논리성, 경험 구체성을 종합적으로 분석하여 역량 보고서를 작성 중입니다. 약 5~10초 정도 소요됩니다.";
    overlayProcessing.classList.add('active');

    try {
      const report = await window.InterviewEngine.getFinalReport();
      overlayProcessing.classList.remove('active');

      showView('report');

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

  function drawRadarChart(scores) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    
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

  btnPrintReport.addEventListener('click', () => {
    window.print();
  });

  btnRestart.addEventListener('click', () => {
    showView('onboarding');
  });

  if (synth) {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }
});
