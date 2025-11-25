import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChildProfile, Question, Answer } from '../types';
import { generateDailyQuestions } from '../utils/questionGenerator';
import { getAnswersByDate, saveAnswer, getAllAnswers } from '../utils/storage';
import QuestionCard from './QuestionCard';
import ParentMessage from './ParentMessage';

interface QuestionFlowProps {
  child: ChildProfile;
}

export default function QuestionFlow({ child }: QuestionFlowProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [todayAnswers, setTodayAnswers] = useState<Answer[]>([]);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const dailyQuestions = generateDailyQuestions(child.ageGroup, today, child.id);
    setQuestions(dailyQuestions);
    setCurrentIndex(0);
    
    const existingAnswers = getAnswersByDate(today, child.id);
    const answerMap = new Map<string, Answer>();
    existingAnswers.forEach(answer => {
      answerMap.set(answer.questionId, answer);
    });
    setAnswers(answerMap);
    
    loadTodayAnswers();
  }, [child.ageGroup, today, child.id]);

  const loadTodayAnswers = () => {
    const allAnswers = getAllAnswers();
    const filtered = allAnswers
      .filter(a => a.childId === child.id && a.date === today)
      .sort((a, b) => b.timestamp - a.timestamp);
    setTodayAnswers(filtered);
  };

  const handleSave = async (questionId: string, answer: Partial<Answer>) => {
    const newAnswer: Answer = {
      id: `answer_${questionId}_${today}_${Date.now()}`,
      questionId,
      childId: child.id,
      date: today,
      ageGroup: child.ageGroup,
      timestamp: Date.now(),
      ...answer,
    };

    saveAnswer(newAnswer);

    const newAnswersMap = new Map(answers);
    newAnswersMap.set(questionId, newAnswer);
    setAnswers(newAnswersMap);

    loadTodayAnswers();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center py-12">질문을 불러오는 중...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.get(currentQuestion.id);
  
  const allAnswered = questions.every(q => answers.has(q.id));

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-airbnb-lg shadow-airbnb-lg p-10 border border-airbnb-gray-100">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-airbnb-dark">
              질문 {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-airbnb-gray-400 font-light">
              {format(new Date(today), 'yyyy년 MM월 dd일')}
            </span>
          </div>
          <div className="w-full bg-airbnb-gray-100 rounded-full h-2">
            <div
              className="bg-airbnb-coral h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          initialAnswer={currentAnswer}
          onAnswer={() => {}}
          onSave={async (answer) => {
            await handleSave(currentQuestion.id, answer);
          }}
        />

        <div className="flex justify-between items-center mt-10">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 text-airbnb-dark hover:text-airbnb-coral disabled:text-airbnb-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-sm rounded-airbnb hover:bg-airbnb-gray-50 disabled:hover:bg-transparent"
          >
            ← 이전
          </button>
          
          {allAnswered && (
            <div className="flex items-center gap-2 text-airbnb-coral">
              <span className="text-sm font-semibold">✓ 모든 질문에 답변했습니다</span>
            </div>
          )}
          
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-3 text-airbnb-dark hover:text-airbnb-coral disabled:text-airbnb-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-sm rounded-airbnb hover:bg-airbnb-gray-50 disabled:hover:bg-transparent"
          >
            다음 →
          </button>
        </div>
      </div>
      
      {allAnswered && (
        <div className="bg-airbnb-light rounded-airbnb-lg shadow-airbnb-lg p-10 border border-airbnb-gray-100">
          <ParentMessage />
        </div>
      )}

      {todayAnswers.length > 0 && (
        <div className="bg-white rounded-airbnb-lg shadow-airbnb-lg p-10 border border-airbnb-gray-100">
          <h3 className="text-2xl font-semibold text-airbnb-dark mb-8 tracking-tight">
            오늘의 답변 이력
          </h3>
          <div className="space-y-4">
            {todayAnswers.map((answer) => {
              const question = questions.find(q => q.id === answer.questionId);
              const answerText = answer.selectedOption || answer.text || '';
              const preview = answerText.length > 50 
                ? answerText.substring(0, 50) + '...' 
                : answerText;
              
              return (
                <div
                  key={answer.id}
                  className="flex items-start gap-5 p-5 bg-airbnb-gray-50 rounded-airbnb hover:bg-white hover:shadow-airbnb transition-all border border-airbnb-gray-100 cursor-pointer group"
                >
                  <div className="text-xs text-airbnb-gray-400 min-w-[70px] font-semibold pt-1">
                    {format(new Date(answer.timestamp), 'HH:mm')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-airbnb-dark mb-2 group-hover:text-airbnb-coral transition-colors">
                      {question?.text || '질문'}
                    </div>
                    <div className="text-sm text-airbnb-gray-400 leading-relaxed">
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



