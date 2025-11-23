import { useState } from 'react';
import { ChildProfile } from './types';
import { getChildProfiles, saveChildProfile } from './utils/storage';
import AgeSelection from './components/AgeSelection';
import QuestionFlow from './components/QuestionFlow';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentChild, setCurrentChild] = useState<ChildProfile | null>(null);
  const [showAgeSelection, setShowAgeSelection] = useState(true);
  const [view, setView] = useState<'questions' | 'dashboard'>('questions');
  const [questionKey, setQuestionKey] = useState<number>(Date.now());

  const handleAgeSelect = (ageGroup: 5 | 8 | 11, name: string) => {
    const profiles = getChildProfiles();
    let profile = profiles.find(p => p.name === name && p.ageGroup === ageGroup);
    
    if (!profile) {
      profile = {
        id: `child_${Date.now()}`,
        name,
        ageGroup,
        createdAt: Date.now(),
      };
      saveChildProfile(profile);
    }
    
    setCurrentChild(profile);
    setShowAgeSelection(false);
  };

  const handleBack = () => {
    setShowAgeSelection(true);
    setCurrentChild(null);
  };

  const handleHome = () => {
    setShowAgeSelection(true);
    setCurrentChild(null);
    setView('questions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <button
            onClick={handleHome}
            className="inline-block hover:opacity-80 transition-opacity cursor-pointer w-full"
          >
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-32 h-32 mb-3">
                <img 
                  src="/logo.jpg" 
                  alt="3용스 로고" 
                  className="w-full h-full rounded-full object-cover border-4 border-primary-200 shadow-lg"
                  onError={(e) => {
                    // 이미지가 없으면 플레이스홀더 표시
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  className="hidden w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-4 border-primary-200 shadow-lg items-center justify-center text-white text-4xl font-bold"
                  style={{ display: 'none' }}
                >
                  3용스
                </div>
              </div>
              <h1 className="text-4xl font-bold text-primary-700 mb-2">
                3용스의 성장 일기
              </h1>
              <p className="text-primary-600 text-lg">
                매일의 질문, 쌓이는 성장
              </p>
            </div>
          </button>
        </header>

        {showAgeSelection ? (
          <AgeSelection onSelect={handleAgeSelect} />
        ) : currentChild ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {currentChild.name} ({currentChild.ageGroup}세)
                </h2>
                <button
                  onClick={handleBack}
                  className="text-sm text-primary-600 hover:text-primary-800 mt-1"
                >
                  ← 다른 아이 선택
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setQuestionKey(Date.now()); // 새로운 질문 세트 생성
                    setView('questions'); // 질문 화면으로 전환
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === 'questions'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-primary-600 border border-primary-300'
                  }`}
                >
                  질문하기
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === 'dashboard'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-primary-600 border border-primary-300'
                  }`}
                >
                  성장 로그
                </button>
              </div>
            </div>

            {view === 'questions' ? (
              <QuestionFlow child={currentChild} questionKey={questionKey} />
            ) : (
              <Dashboard child={currentChild} />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;

