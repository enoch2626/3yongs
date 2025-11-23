import { format } from 'date-fns';
import { Answer } from '../types';
import { getDailyQuestions } from '../data/questions';

interface DailyLogViewProps {
  answers: Answer[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DailyLogView({
  answers,
  selectedDate,
  onDateChange,
}: DailyLogViewProps) {
  // 연령 추정 (답변에서 첫 번째 답변의 ageGroup 사용, 없으면 기본값 5)
  const ageGroup = answers.length > 0 ? answers[0].ageGroup : 5;
  const questions = getDailyQuestions(ageGroup);

  const getAnswersForQuestion = (questionId: string): Answer[] => {
    return answers
      .filter(a => a.questionId === questionId)
      .sort((a, b) => b.timestamp - a.timestamp); // 최신 답변이 위로
  };

  if (answers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-600 text-lg mb-4">
          {format(new Date(selectedDate), 'yyyy년 MM월 dd일')}에는
        </p>
        <p className="text-gray-500">
          아직 기록이 없어요.
        </p>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="mt-6 px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">
          {format(new Date(selectedDate), 'yyyy년 MM월 dd일')}
        </h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="space-y-4">
        {questions.map((question) => {
          const questionAnswers = getAnswersForQuestion(question.id);
          if (questionAnswers.length === 0) return null;

          return (
            <div
              key={question.id}
              className="bg-gray-50 rounded-lg p-5 border-l-4 border-primary-500"
            >
              <div className="font-semibold text-gray-800 mb-3">
                {question.text}
              </div>
              <div className="space-y-3">
                {questionAnswers.map((answer, index) => (
                  <div
                    key={answer.id}
                    className={`${index > 0 ? 'pt-3 border-t border-gray-200' : ''}`}
                  >
                    <div className="text-gray-700">
                      {answer.selectedOption ? (
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full font-medium">
                          {answer.selectedOption}
                        </span>
                      ) : (
                        <p className="whitespace-pre-wrap">{answer.text}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {format(new Date(answer.timestamp), 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

