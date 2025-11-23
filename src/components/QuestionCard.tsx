import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Lightbulb } from 'lucide-react';
import { Question, Answer } from '../types';
import { SpeechRecognizer } from '../utils/audio';
import '../App.css';

interface QuestionCardProps {
  question: Question;
  initialAnswer?: Answer;
  onAnswer: (answer: Partial<Answer>) => void;
  onSave?: (answer: Partial<Answer>) => Promise<void>; // 저장 완료 콜백
}

export default function QuestionCard({
  question,
  initialAnswer,
  onAnswer,
  onSave,
}: QuestionCardProps) {
  const [text, setText] = useState(initialAnswer?.text || '');
  const [isListening, setIsListening] = useState(false);
  const [speechRecognizer, setSpeechRecognizer] = useState<SpeechRecognizer | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousQuestionId = useRef<string>(question.id);

  // question이 변경될 때만 초기화 (커서 떨림 방지)
  useEffect(() => {
    if (previousQuestionId.current !== question.id) {
      // 새로운 질문으로 변경된 경우에만 초기화
      const savedText = initialAnswer?.text || '';
      setText(savedText);
      previousQuestionId.current = question.id;
      setShowGuide(false); // 가이드도 초기화
      
      // 텍스트 영역 포커스
      if (textareaRef.current && !savedText) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      }
    }
    // initialAnswer는 question.id가 변경될 때만 사용하므로 의존성에서 제거
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    try {
      const recognizer = new SpeechRecognizer();
      setSpeechRecognizer(recognizer);
    } catch (error) {
      console.log('음성 인식이 지원되지 않습니다.');
    }
  }, []);

  // 자동 저장은 제거하고 버튼 클릭 시에만 저장

  const handleVoiceInput = () => {
    if (!speechRecognizer) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isListening) {
      speechRecognizer.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechRecognizer.start(
        (transcript) => {
          setText(transcript);
          setIsListening(false);
        },
        (error) => {
          console.error('음성 인식 오류:', error);
          setIsListening(false);
          alert('음성 인식 중 오류가 발생했습니다.');
        }
      );
    }
  };

  const handleSave = async () => {
    if (!text) {
      return; // 답변이 없으면 저장하지 않음
    }

    setSaveStatus('saving');
    
    try {
      const answerData: Partial<Answer> = {
        text: text,
      };

      if (onSave) {
        await onSave(answerData);
      } else {
        onAnswer(answerData);
      }

      // 저장 성공 후 textarea 비우기
      setText('');
      
      setSaveStatus('saved');
      setShowCelebration(true);
      
      // 축하 애니메이션 3초 후 숨기기
      setTimeout(() => {
        setShowCelebration(false);
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('저장 실패:', error);
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* 축하 애니메이션 */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="text-9xl celebrate-emoji">🎉</div>
            <div className="absolute -top-8 -left-8 text-5xl float-emoji" style={{ animationDelay: '0s' }}>✨</div>
            <div className="absolute -top-8 -right-8 text-5xl float-emoji" style={{ animationDelay: '0.2s' }}>⭐</div>
            <div className="absolute -bottom-8 -left-8 text-5xl float-emoji" style={{ animationDelay: '0.4s' }}>🌟</div>
            <div className="absolute -bottom-8 -right-8 text-5xl float-emoji" style={{ animationDelay: '0.6s' }}>💫</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl float-emoji" style={{ animationDelay: '0.3s' }}>🎊</div>
          </div>
        </div>
      )}
      
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800 flex-1">
            {question.text}
          </h3>
          {question.exampleGuide && (
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="ml-4 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="답변 예시 보기"
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          )}
        </div>
        {question.exampleGuide && showGuide && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  💡 답변 예시:
                </p>
                <p className="text-sm text-blue-700 whitespace-pre-line">
                  {question.exampleGuide}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="답변을 입력하세요..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            {speechRecognizer && (
              <button
                onClick={handleVoiceInput}
                className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                }`}
                title="음성으로 답변하기"
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          {isListening && (
            <div className="text-sm text-primary-600 text-center animate-pulse">
              🎤 듣고 있어요... 말씀해주세요
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              disabled={!text || saveStatus === 'saving'}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {saveStatus === 'saving' ? '저장 중...' : '입력하기'}
            </button>
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🎉</span>
                <span className="text-sm text-green-600 font-medium">
                  저장되었습니다!
                </span>
              </div>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-600 font-medium">
                저장에 실패했습니다
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

