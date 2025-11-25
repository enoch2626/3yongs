import { Question, AgeGroup, QuestionCategory } from '../types';

// 날짜 기반 시드 생성 (같은 날짜면 같은 질문)
function getDateSeed(date: string): number {
  const dateStr = date.replace(/-/g, '');
  return parseInt(dateStr, 10);
}

// 시드 기반 랜덤 함수
function createSeededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// 질문 풀 (각 연령별로 더 많은 질문 추가 - AI처럼 매일 다른 질문을 위해 확장)
const questionPool: Record<AgeGroup, Record<QuestionCategory, Question[]>> = {
  5: {
    emotion: [
      { id: '5-emotion-1', category: 'emotion', text: '오늘 기분이 어땠어?', ageGroup: 5, exampleGuide: '예: 웃음\n예: 화남\n예: 신남\n예: 피곤함' },
      { id: '5-emotion-2', category: 'emotion', text: '오늘 어떤 감정을 느꼈어?', ageGroup: 5, exampleGuide: '예: 기쁨\n예: 슬픔\n예: 화남\n예: 무서움' },
      { id: '5-emotion-3', category: 'emotion', text: '오늘 가장 기분 좋았던 순간은?', ageGroup: 5, exampleGuide: '예: 친구랑 놀았을 때\n예: 맛있는 거 먹었을 때' },
      { id: '5-emotion-4', category: 'emotion', text: '오늘 뭐가 가장 재미있었어?', ageGroup: 5, exampleGuide: '예: 장난감으로 놀았을 때\n예: 엄마랑 그림 그렸을 때' },
      { id: '5-emotion-5', category: 'emotion', text: '오늘 웃었던 일이 있어?', ageGroup: 5, exampleGuide: '예: 친구가 재미있는 말을 했어요\n예: 엄마가 장난을 쳤어요' },
      { id: '5-emotion-6', category: 'emotion', text: '오늘 슬펐던 일이 있어?', ageGroup: 5, exampleGuide: '예: 장난감이 부서졌어요\n예: 친구가 집에 갔어요\n예: 없었어요' },
      { id: '5-emotion-7', category: 'emotion', text: '오늘 누가 가장 좋았어?', ageGroup: 5, exampleGuide: '예: 엄마\n예: 친구 민수\n예: 형' },
      { id: '5-emotion-8', category: 'emotion', text: '오늘 하루를 색깔로 표현한다면?', ageGroup: 5, exampleGuide: '예: 노란색 - 기분이 좋아서\n예: 파란색 - 평온했어서' },
    ],
    learning: [
      { id: '5-learning-1', category: 'learning', text: '오늘 뭐가 가장 재미있었어?', ageGroup: 5, exampleGuide: '예: 장난감으로 놀았을 때\n예: 엄마랑 그림 그렸을 때\n예: 친구랑 뛰어놀았을 때' },
      { id: '5-learning-2', category: 'learning', text: '오늘 새로운 걸 해봤어?', ageGroup: 5, exampleGuide: '예: 새로운 장난감을 만졌어요\n예: 처음으로 자전거를 탔어요\n예: 새로운 음식을 먹어봤어요' },
      { id: '5-learning-3', category: 'learning', text: '누구랑 놀 때 즐거웠어?', ageGroup: 5, exampleGuide: '예: 친구 민수랑\n예: 엄마랑\n예: 형이랑' },
      { id: '5-learning-4', category: 'learning', text: '오늘 뭘 배웠어?', ageGroup: 5, exampleGuide: '예: 숫자 세는 법\n예: 색깔 이름\n예: 동물 이름' },
      { id: '5-learning-5', category: 'learning', text: '오늘 어려운 일이 있었어?', ageGroup: 5, exampleGuide: '예: 장난감을 못 찾았어요\n예: 친구가 장난감을 안 줬어요\n예: 없었어요' },
      { id: '5-learning-6', category: 'learning', text: '오늘 누가 도와줬어?', ageGroup: 5, exampleGuide: '예: 엄마가 도와줬어요\n예: 형이 도와줬어요' },
      { id: '5-learning-7', category: 'learning', text: '오늘 뭐가 신기했어?', ageGroup: 5, exampleGuide: '예: 비가 왔어요\n예: 새 동물을 봤어요' },
      { id: '5-learning-8', category: 'learning', text: '오늘 혼자서 해낸 일이 있어?', ageGroup: 5, exampleGuide: '예: 옷을 입었어요\n예: 장난감을 정리했어요' },
      { id: '5-learning-9', category: 'learning', text: '오늘 누군가를 도와줬어?', ageGroup: 5, exampleGuide: '예: 동생을 도와줬어요\n예: 엄마를 도와줬어요' },
      { id: '5-learning-10', category: 'learning', text: '오늘 가장 자랑스러웠던 일은?', ageGroup: 5, exampleGuide: '예: 그림을 잘 그렸어요\n예: 친구와 잘 놀았어요' },
    ],
    tomorrow: [
      { id: '5-tomorrow-1', category: 'tomorrow', text: '내일 뭐 하면 좋을까?', ageGroup: 5, exampleGuide: '예: 공원에 가고 싶어요\n예: 그림 그리기\n예: 친구랑 놀기' },
      { id: '5-tomorrow-2', category: 'tomorrow', text: '내일 누구랑 놀고 싶어?', ageGroup: 5, exampleGuide: '예: 친구 민수랑\n예: 엄마랑\n예: 형이랑' },
      { id: '5-tomorrow-3', category: 'tomorrow', text: '내일 뭐가 기대돼?', ageGroup: 5, exampleGuide: '예: 공원에 가는 것\n예: 새로운 장난감\n예: 맛있는 음식' },
      { id: '5-tomorrow-4', category: 'tomorrow', text: '내일 하고 싶은 게 있어?', ageGroup: 5, exampleGuide: '예: 그림 그리기\n예: 책 읽기\n예: 놀이터 가기' },
      { id: '5-tomorrow-5', category: 'tomorrow', text: '내일은 어떤 하루가 될까?', ageGroup: 5, exampleGuide: '예: 재미있는 하루\n예: 신나는 하루' },
      { id: '5-tomorrow-6', category: 'tomorrow', text: '내일 배우고 싶은 게 있어?', ageGroup: 5, exampleGuide: '예: 새로운 놀이\n예: 새로운 단어' },
    ],
  },
  8: {
    emotion: [
      { id: '8-emotion-1', category: 'emotion', text: '오늘 가장 좋았던 순간은 뭐였어?', ageGroup: 8, exampleGuide: '예: 친구와 재미있게 놀았을 때\n예: 엄마가 맛있는 음식을 만들어줬을 때\n예: 운동을 잘했을 때' },
      { id: '8-emotion-2', category: 'emotion', text: '오늘 어떤 감정이 가장 컸어?', ageGroup: 8, exampleGuide: '예: 기쁨 - 친구와 재미있게 놀아서\n예: 자랑스러움 - 숙제를 잘 끝냈어서\n예: 신남 - 새로운 게임을 해서' },
      { id: '8-emotion-3', category: 'emotion', text: '오늘 기분이 어떻게 변했어?', ageGroup: 8, exampleGuide: '예: 아침에는 피곤했는데 친구들과 놀면서 기분이 좋아졌어요' },
      { id: '8-emotion-4', category: 'emotion', text: '오늘 감정을 색깔로 표현한다면?', ageGroup: 8, exampleGuide: '예: 노란색 - 기쁨\n예: 파란색 - 평온함\n예: 빨간색 - 신남' },
      { id: '8-emotion-5', category: 'emotion', text: '오늘 누군가에게 고마웠던 일이 있어?', ageGroup: 8, exampleGuide: '예: 친구가 도와줬어요\n예: 엄마가 맛있는 걸 만들어줬어요' },
      { id: '8-emotion-6', category: 'emotion', text: '오늘 가장 행복했던 순간은?', ageGroup: 8, exampleGuide: '예: 가족과 함께 있을 때\n예: 친구들과 놀 때' },
    ],
    learning: [
      { id: '8-learning-1', category: 'learning', text: '오늘 어려웠던 일은 있었어? 어떻게 해결했어?', ageGroup: 8, exampleGuide: '예: 숙제가 어려웠는데 엄마한테 물어봤어요\n예: 친구와 싸웠는데 먼저 사과했어요\n예: 없었어요' },
      { id: '8-learning-2', category: 'learning', text: '오늘 너 자신에게 자랑스러웠던 일은 뭐야?', ageGroup: 8, exampleGuide: '예: 숙제를 혼자서 다 끝냈어요\n예: 친구를 도와줬어요\n예: 운동을 열심히 했어요' },
      { id: '8-learning-3', category: 'learning', text: '오늘 누군가에게 친절하게 한 일이 있어?', ageGroup: 8, exampleGuide: '예: 친구가 넘어졌을 때 일으켜줬어요\n예: 동생에게 장난감을 나눠줬어요\n예: 엄마를 도와드렸어요' },
      { id: '8-learning-4', category: 'learning', text: '오늘 배운 것 중 기억에 남는 건 뭐야?', ageGroup: 8, exampleGuide: '예: 수학 문제를 풀었어요\n예: 과학 실험을 했어요\n예: 책에서 새로운 사실을 알았어요' },
      { id: '8-learning-5', category: 'learning', text: '오늘 도전한 일이 있어?', ageGroup: 8, exampleGuide: '예: 어려운 운동을 시도했어요\n예: 새로운 게임을 해봤어요\n예: 친구에게 먼저 말을 걸어봤어요' },
      { id: '8-learning-6', category: 'learning', text: '오늘 실수했지만 배운 게 있어?', ageGroup: 8, exampleGuide: '예: 실수했지만 다시 해봤어요\n예: 친구에게 배웠어요' },
      { id: '8-learning-7', category: 'learning', text: '오늘 누군가에게 배운 점이 있어?', ageGroup: 8, exampleGuide: '예: 친구의 태도에서 배웠어요\n예: 선생님의 조언이 도움이 됐어요' },
      { id: '8-learning-8', category: 'learning', text: '오늘 스스로 해결한 문제가 있어?', ageGroup: 8, exampleGuide: '예: 숙제를 혼자 풀었어요\n예: 친구와의 문제를 해결했어요' },
      { id: '8-learning-9', category: 'learning', text: '오늘 가장 뿌듯했던 순간은?', ageGroup: 8, exampleGuide: '예: 어려운 문제를 풀었을 때\n예: 친구를 도와줬을 때' },
    ],
    tomorrow: [
      { id: '8-tomorrow-1', category: 'tomorrow', text: '내일 더 잘하고 싶은 게 있다면 뭐야?', ageGroup: 8, exampleGuide: '예: 숙제를 더 빨리 끝내고 싶어요\n예: 친구와 더 잘 지내고 싶어요\n예: 운동을 더 열심히 하고 싶어요' },
      { id: '8-tomorrow-2', category: 'tomorrow', text: '내일 새로운 걸 시도해보고 싶은 게 있어?', ageGroup: 8, exampleGuide: '예: 새로운 운동을 해보고 싶어요\n예: 새로운 책을 읽고 싶어요\n예: 새로운 요리를 만들어보고 싶어요' },
      { id: '8-tomorrow-3', category: 'tomorrow', text: '내일의 너에게 한마디 한다면?', ageGroup: 8, exampleGuide: '예: 열심히 하자!\n예: 즐겁게 보내자!\n예: 친구들과 잘 지내자!' },
      { id: '8-tomorrow-4', category: 'tomorrow', text: '내일 목표를 하나 정한다면?', ageGroup: 8, exampleGuide: '예: 숙제를 다 끝내기\n예: 친구 한 명에게 친절하게 하기' },
    ],
  },
  11: {
    emotion: [
      { id: '11-emotion-1', category: 'emotion', text: '오늘 네 감정 중 가장 강했던 감정은 뭐였고, 왜 그랬다고 생각해?', ageGroup: 11, exampleGuide: '예: 기쁨 - 친구들과 재미있게 놀아서\n예: 자랑스러움 - 시험을 잘 봐서\n예: 걱정 - 내일 시험이 있어서' },
      { id: '11-emotion-2', category: 'emotion', text: '오늘 감정이 어떻게 변했어?', ageGroup: 11, exampleGuide: '예: 아침에는 피곤했는데 친구들과 놀면서 기분이 좋아졌어요\n예: 처음에는 걱정됐는데 문제를 해결하니까 안심됐어요' },
      { id: '11-emotion-3', category: 'emotion', text: '오늘 가장 기억에 남는 감정은?', ageGroup: 11, exampleGuide: '예: 친구와의 대화에서 느낀 기쁨\n예: 어려운 문제를 풀었을 때의 뿌듯함' },
      { id: '11-emotion-4', category: 'emotion', text: '오늘 감정을 조절한 순간이 있었어?', ageGroup: 11, exampleGuide: '예: 화가 났지만 참았어요\n예: 슬펐지만 긍정적으로 생각했어요' },
      { id: '11-emotion-5', category: 'emotion', text: '오늘 누군가의 감정을 이해한 적이 있어?', ageGroup: 11, exampleGuide: '예: 친구의 기분을 이해했어요\n예: 가족의 감정을 느꼈어요' },
      { id: '11-emotion-6', category: 'emotion', text: '오늘 감정을 표현한 방법은?', ageGroup: 11, exampleGuide: '예: 말로 표현했어요\n예: 행동으로 보여줬어요' },
    ],
    learning: [
      { id: '11-learning-1', category: 'learning', text: '오늘 배운 것 중 앞으로 도움이 될 것 같은 건 뭐야?', ageGroup: 11, exampleGuide: '예: 수학 공식을 배웠는데 다음 시험에 도움이 될 것 같아요\n예: 친구와의 대화 방법을 배웠어요\n예: 시간 관리하는 방법을 알게 됐어요' },
      { id: '11-learning-2', category: 'learning', text: '오늘 스스로 성장했다고 느낀 순간이 있었어?', ageGroup: 11, exampleGuide: '예: 어려운 문제를 혼자서 풀었을 때\n예: 친구의 감정을 이해하고 도와줬을 때\n예: 실수를 인정하고 사과했을 때' },
      { id: '11-learning-3', category: 'learning', text: '만약 오늘 하루를 다시 산다면 무엇을 다르게 할까?', ageGroup: 11, exampleGuide: '예: 친구에게 더 친절하게 했을 거예요\n예: 숙제를 더 일찍 시작했을 거예요\n예: 엄마를 더 도와드렸을 거예요' },
      { id: '11-learning-4', category: 'learning', text: '오늘 네가 가장 잘한 일은 뭐야?', ageGroup: 11, exampleGuide: '예: 시험을 열심히 봤어요\n예: 친구를 도와줬어요\n예: 가족을 도와드렸어요' },
      { id: '11-learning-5', category: 'learning', text: '오늘 실수했지만 배운 게 있어?', ageGroup: 11, exampleGuide: '예: 친구와 싸웠는데 대화의 중요성을 배웠어요\n예: 숙제를 깜빡했는데 계획의 중요성을 알게 됐어요' },
      { id: '11-learning-6', category: 'learning', text: '오늘 누군가에게 배운 점이 있어?', ageGroup: 11, exampleGuide: '예: 친구의 태도에서 배웠어요\n예: 선생님의 조언이 도움이 됐어요' },
      { id: '11-learning-7', category: 'learning', text: '오늘 도전했지만 아직 완성하지 못한 게 있어?', ageGroup: 11, exampleGuide: '예: 새로운 프로젝트를 시작했어요\n예: 어려운 문제에 도전했어요' },
      { id: '11-learning-8', category: 'learning', text: '오늘 자신의 한계를 느낀 순간이 있었어?', ageGroup: 11, exampleGuide: '예: 어려운 문제를 풀지 못했어요\n예: 하지만 다시 도전할 거예요' },
      { id: '11-learning-9', category: 'learning', text: '오늘 다른 사람의 관점을 이해한 적이 있어?', ageGroup: 11, exampleGuide: '예: 친구의 입장에서 생각해봤어요\n예: 부모님의 마음을 이해했어요' },
      { id: '11-learning-10', category: 'learning', text: '오늘 스스로 결정한 일이 있어?', ageGroup: 11, exampleGuide: '예: 공부 시간을 정했어요\n예: 친구와의 문제를 해결했어요' },
    ],
    tomorrow: [
      { id: '11-tomorrow-1', category: 'tomorrow', text: '내일의 너에게 한마디 메시지를 남긴다면 뭐라고 하고 싶어?', ageGroup: 11, exampleGuide: '예: 자신감을 가지고 하루를 시작하자!\n예: 친구들과 잘 지내자!\n예: 열심히 노력하자!' },
      { id: '11-tomorrow-2', category: 'tomorrow', text: '내일 더 발전하고 싶은 부분은 뭐야?', ageGroup: 11, exampleGuide: '예: 공부를 더 열심히 하고 싶어요\n예: 친구들과 더 잘 소통하고 싶어요\n예: 시간 관리를 더 잘하고 싶어요' },
      { id: '11-tomorrow-3', category: 'tomorrow', text: '내일의 목표를 세워본다면?', ageGroup: 11, exampleGuide: '예: 숙제를 모두 끝내기\n예: 친구 한 명에게 친절하게 하기\n예: 운동 30분 하기' },
      { id: '11-tomorrow-4', category: 'tomorrow', text: '내일 새로운 걸 시도해볼 계획이 있어?', ageGroup: 11, exampleGuide: '예: 새로운 공부 방법을 시도해볼 거예요\n예: 새로운 취미를 시작해볼 거예요' },
      { id: '11-tomorrow-5', category: 'tomorrow', text: '내일은 어떤 하루가 되길 바라?', ageGroup: 11, exampleGuide: '예: 성장하는 하루\n예: 즐거운 하루' },
      { id: '11-tomorrow-6', category: 'tomorrow', text: '내일 더 잘하고 싶은 관계는?', ageGroup: 11, exampleGuide: '예: 친구들과의 관계\n예: 가족과의 관계' },
    ],
  },
};

/**
 * 날짜와 아이 정보를 기반으로 매일 다른 질문을 생성합니다.
 * 같은 날짜, 같은 아이면 항상 같은 질문이 나옵니다.
 */
export function generateDailyQuestions(
  ageGroup: AgeGroup,
  date: string,
  childId: string
): Question[] {
  const dateSeed = getDateSeed(date);
  const childSeed = childId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combinedSeed = dateSeed + childSeed;
  
  const randomFn = createSeededRandom(combinedSeed);
  const pool = questionPool[ageGroup];
  
  const emotionQuestion = getRandomQuestion(pool.emotion, randomFn);
  const learningQuestion = getRandomQuestion(pool.learning, randomFn);
  const tomorrowQuestion = getRandomQuestion(pool.tomorrow, randomFn);
  
  return [emotionQuestion, learningQuestion, tomorrowQuestion].filter(
    (q): q is Question => q !== undefined
  );
}

function getRandomQuestion(
  questions: Question[],
  randomFn: () => number
): Question | undefined {
  if (questions.length === 0) return undefined;
  const randomIndex = Math.floor(randomFn() * questions.length);
  return questions[randomIndex];
}



