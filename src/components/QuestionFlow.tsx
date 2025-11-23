import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChildProfile, Question, Answer } from '../types';
import { getDailyQuestions } from '../data/questions';
import { getAnswersByDate, saveAnswer, getAllAnswers } from '../utils/storage';
import QuestionCard from './QuestionCard';
import ParentMessage from './ParentMessage';

interface QuestionFlowProps {
  child: ChildProfile;
  questionKey?: number; // 질문 세트를 변경하기 위한 키
}

export default function QuestionFlow({ child, questionKey }: QuestionFlowProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [todayAnswers, setTodayAnswers] = useState<Answer[]>([]);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    // questionKey가 변경되면 새로운 질문 세트 생성 (기존 답변 무시)
    const seed = questionKey || Date.now();
    const dailyQuestions = getDailyQuestions(child.ageGroup, seed);
    setQuestions(dailyQuestions);
    setCurrentIndex(0);
    setAnswers(new Map()); // 새로운 질문 세트이므로 답변 초기화
    
    // questionKey가 변경되지 않았을 때만 기존 답변 불러오기
    if (!questionKey) {
      const existingAnswers = getAnswersByDate(today, child.id);
      const answerMap = new Map<string, Answer>();
      existingAnswers.forEach(answer => {
        answerMap.set(answer.questionId, answer);
      });
      setAnswers(answerMap);
    }
  }, [child.ageGroup, today, questionKey]);

  const handleAnswer = (_questionId: string, _answer: Partial<Answer>) => {
    // 이 함수는 더 이상 자동 저장하지 않음 (버튼 클릭 시에만 저장)
  };

  const handleSave = async (questionId: string, answer: Partial<Answer>) => {
    // timestamp를 포함한 답변 생성
    const newAnswer: Answer = {
      id: `answer_${questionId}_${today}_${Date.now()}`, // 고유 ID를 위해 timestamp 추가
      questionId,
      childId: child.id,
      date: today,
      ageGroup: child.ageGroup,
      timestamp: Date.now(), // 저장 시점의 timestamp
      ...answer,
    };

    // 저장
    saveAnswer(newAnswer);

    // 상태 업데이트 (최신 답변만 유지)
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, newAnswer);
    setAnswers(newAnswers);

    // 오늘의 답변 이력 새로고침
    loadTodayAnswers();
  };

  const loadTodayAnswers = () => {
    const allAnswers = getAllAnswers();
    const todayAnswersList = allAnswers
      .filter(a => a.childId === child.id && a.date === today)
      .sort((a, b) => b.timestamp - a.timestamp); // 최신 답변이 위로
    setTodayAnswers(todayAnswersList);
  };

  useEffect(() => {
    loadTodayAnswers();
  }, [child.id, today]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-600">질문을 불러오는 중...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.get(currentQuestion.id);
  
  // 모든 질문에 답했는지 확인
  const allAnswered = questions.every(q => answers.has(q.id));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-primary-600">
              질문 {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(today), 'yyyy년 MM월 dd일')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          initialAnswer={currentAnswer}
          onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
          onSave={async (answer) => {
            await handleSave(currentQuestion.id, answer);
          }}
        />

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-primary-600 hover:text-primary-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ← 이전
          </button>
          
          {allAnswered && (
            <div className="flex items-center gap-2 text-primary-600">
              <span className="text-sm">✓ 모든 질문에 답변했습니다</span>
            </div>
          )}
          
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 text-primary-600 hover:text-primary-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            다음 →
          </button>
        </div>
      </div>
      
      {allAnswered && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl shadow-lg p-6 border-l-4 border-primary-500">
          <ParentMessage />
        </div>
      )}

      {/* 오늘의 답변 이력 */}
      {todayAnswers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            오늘의 답변 이력
          </h3>
          <div className="space-y-2">
            {todayAnswers.map((answer) => {
              const question = questions.find(q => q.id === answer.questionId);
              const answerText = answer.selectedOption || answer.text || '';
              const preview = answerText.length > 30 
                ? answerText.substring(0, 30) + '...' 
                : answerText;
              
              return (
                <div
                  key={answer.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-xs text-gray-500 min-w-[60px]">
                    {format(new Date(answer.timestamp), 'HH:mm')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {question?.text || '질문'}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {preview}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

