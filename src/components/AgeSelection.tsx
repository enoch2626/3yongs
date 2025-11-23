import { AgeGroup } from '../types';

interface AgeSelectionProps {
  onSelect: (ageGroup: AgeGroup, name: string) => void;
}

// 연령별 고정 이름 매핑
const AGE_TO_NAME: Record<AgeGroup, string> = {
  5: '용준',
  8: '용제',
  11: '용후',
};

export default function AgeSelection({ onSelect }: AgeSelectionProps) {
  const ageOptions: { age: AgeGroup; label: string; name: string; description: string }[] = [
    { age: 5, label: '5세', name: '용준', description: '단순하고 구체적인 질문' },
    { age: 8, label: '8세', name: '용제', description: '관찰과 비교가 가능한 질문' },
    { age: 11, label: '11세', name: '용후', description: '반성과 추론이 가능한 질문' },
  ];

  const handleSelect = (ageGroup: AgeGroup) => {
    const name = AGE_TO_NAME[ageGroup];
    onSelect(ageGroup, name);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        누구의 질문을 시작할까요?
      </h2>
      
      <div className="space-y-4">
        {ageOptions.map((option) => (
          <button
            key={option.age}
            onClick={() => handleSelect(option.age)}
            className="w-full text-left p-5 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xl text-gray-800 group-hover:text-primary-700">
                  {option.name} ({option.label})
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {option.description}
                </div>
              </div>
              <div className="text-primary-500 text-2xl group-hover:scale-110 transition-transform">
                →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

