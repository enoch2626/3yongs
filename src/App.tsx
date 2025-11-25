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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <header className="text-center mb-16">
          <button
            onClick={handleHome}
            className="inline-block hover:opacity-90 transition-opacity cursor-pointer w-full group"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-32 h-32 mb-6">
                <img 
                  src="/logo.jpg" 
                  alt="3용스 로고" 
                  className="w-full h-full rounded-full object-cover shadow-airbnb-lg transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  className="hidden w-full h-full rounded-full bg-gradient-to-br from-airbnb-coral via-airbnb-pink to-airbnb-red shadow-airbnb-lg items-center justify-center text-white text-4xl font-bold"
                  style={{ display: 'none' }}
                >
                  3용스
                </div>
              </div>
              <h1 className="text-6xl font-bold text-airbnb-dark mb-4 tracking-tight">
                3용스의 성장 일기
              </h1>
              <p className="text-airbnb-gray-400 text-2xl font-light">
                매일의 질문, 쌓이는 성장
              </p>
            </div>
          </button>
        </header>

        {showAgeSelection ? (
          <AgeSelection onSelect={handleAgeSelect} />
        ) : currentChild ? (
          <>
            <div className="mb-10 flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-semibold text-airbnb-dark mb-3 tracking-tight">
                  {currentChild.name} ({currentChild.ageGroup}세)
                </h2>
                <button
                  onClick={handleBack}
                  className="text-sm text-airbnb-gray-400 hover:text-airbnb-dark transition-colors font-medium underline-offset-2 hover:underline"
                >
                  ← 다른 아이 선택
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setView('questions');
                  }}
                  className={`px-8 py-3.5 rounded-airbnb font-semibold text-sm transition-all ${
                    view === 'questions'
                      ? 'bg-airbnb-coral text-white shadow-airbnb hover:shadow-airbnb-lg hover:bg-airbnb-red'
                      : 'bg-white text-airbnb-dark border border-airbnb-gray-200 hover:border-airbnb-coral shadow-sm hover:shadow-airbnb'
                  }`}
                >
                  질문하기
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-8 py-3.5 rounded-airbnb font-semibold text-sm transition-all ${
                    view === 'dashboard'
                      ? 'bg-airbnb-coral text-white shadow-airbnb hover:shadow-airbnb-lg hover:bg-airbnb-red'
                      : 'bg-white text-airbnb-dark border border-airbnb-gray-200 hover:border-airbnb-coral shadow-sm hover:shadow-airbnb'
                  }`}
                >
                  성장 로그
                </button>
              </div>
            </div>

            {view === 'questions' ? (
              <QuestionFlow child={currentChild} />
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
