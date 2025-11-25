import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Lightbulb } from 'lucide-react';
import { Question, Answer } from '../types';
import { SpeechRecognizer } from '../utils/audio';
import '../App.css';

interface QuestionCardProps {
  question: Question;
  initialAnswer?: Answer;
  onAnswer?: (answer: Partial<Answer>) => void;
  onSave: (answer: Partial<Answer>) => Promise<void>;
}

export default function QuestionCard({
  question,
  initialAnswer,
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

  useEffect(() => {
    const recognizer = new SpeechRecognizer();
    if (recognizer.isAvailable()) {
      setSpeechRecognizer(recognizer);
    }
  }, []);

  useEffect(() => {
    if (previousQuestionId.current !== question.id) {
      const savedText = initialAnswer?.text || '';
      setText(savedText);
      previousQuestionId.current = question.id;
      setShowGuide(false);
      setSaveStatus('idle');

      if (textareaRef.current && !savedText) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      }
    } else if (initialAnswer && text !== (initialAnswer.text || '')) {
      setText(initialAnswer.text || '');
    }
  }, [question.id, initialAnswer]);

  const handleVoiceInput = () => {
    if (!speechRecognizer) return;

    if (isListening) {
      speechRecognizer.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechRecognizer.start(
        (transcript: string) => {
          setText(prev => prev + ' ' + transcript);
          setIsListening(false);
        },
        (error: string) => {
          console.error('음성 인식 오류:', error);
          setIsListening(false);
        }
      );
    }
  };

  const handleSave = async () => {
    if (!text.trim()) {
      return;
    }

    setSaveStatus('saving');

    try {
      const answerData: Partial<Answer> = {
        text: text.trim(),
      };

      await onSave(answerData);

      setText('');
      setSaveStatus('saved');
      setShowCelebration(true);

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
        <div className="flex items-start justify-between mb-8">
          <h3 className="text-4xl font-semibold text-airbnb-dark flex-1 leading-tight tracking-tight">
            {question.text}
          </h3>
          {question.exampleGuide && (
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="ml-6 p-3 text-airbnb-gray-400 hover:text-airbnb-coral hover:bg-airbnb-gray-50 rounded-airbnb transition-all"
              title="답변 예시 보기"
            >
              <Lightbulb className="w-6 h-6" />
            </button>
          )}
        </div>
        {question.exampleGuide && showGuide && (
          <div className="bg-airbnb-light border border-airbnb-gray-200 p-6 rounded-airbnb-lg mb-8 shadow-sm">
            <div className="flex items-start">
              <Lightbulb className="w-6 h-6 text-airbnb-coral mt-0.5 mr-4 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-airbnb-dark mb-3">
                  💡 답변 예시:
                </p>
                <p className="text-sm text-airbnb-gray-400 whitespace-pre-line leading-relaxed">
                  {question.exampleGuide}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="답변을 입력하세요..."
            rows={7}
            className="w-full px-6 py-5 border border-airbnb-gray-200 rounded-airbnb-lg focus:ring-2 focus:ring-airbnb-coral focus:border-airbnb-coral resize-none text-airbnb-dark placeholder-airbnb-gray-300 transition-all text-base leading-relaxed"
          />
          {speechRecognizer && (
            <button
              onClick={handleVoiceInput}
              className={`absolute bottom-5 right-5 p-3 rounded-full transition-all shadow-airbnb ${
                isListening
                  ? 'bg-airbnb-coral text-white animate-pulse'
                  : 'bg-white text-airbnb-gray-400 hover:text-airbnb-coral border border-airbnb-gray-200 hover:border-airbnb-coral hover:shadow-airbnb-lg'
              }`}
              title="음성으로 답변하기"
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
        {isListening && (
          <div className="text-sm text-airbnb-coral text-center animate-pulse font-semibold">
            🎤 듣고 있어요... 말씀해주세요
          </div>
        )}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handleSave}
            disabled={!text.trim() || saveStatus === 'saving'}
            className="px-10 py-4 bg-airbnb-coral text-white rounded-airbnb-lg font-semibold hover:bg-airbnb-red disabled:bg-airbnb-gray-300 disabled:cursor-not-allowed transition-all shadow-airbnb hover:shadow-airbnb-lg disabled:shadow-none text-base"
          >
            {saveStatus === 'saving' ? '저장 중...' : '입력하기'}
          </button>
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">🎉</span>
              <span className="text-base text-airbnb-coral font-semibold">
                저장되었습니다!
              </span>
            </div>
          )}
          {saveStatus === 'error' && (
            <span className="text-base text-airbnb-red font-semibold">
              저장에 실패했습니다
            </span>
          )}
        </div>
      </div>
    </div>
  );
}



