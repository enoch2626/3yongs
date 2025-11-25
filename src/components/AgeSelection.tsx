import { AgeGroup } from '../types';

interface AgeSelectionProps {
  onSelect: (ageGroup: AgeGroup, name: string) => void;
}

export default function AgeSelection({ onSelect }: AgeSelectionProps) {
  const ageOptions: { age: AgeGroup; label: string; name: string; description: string }[] = [
    { age: 5, label: '5세', name: '용준', description: '단순하고 구체적인 질문' },
    { age: 8, label: '8세', name: '용제', description: '관찰과 비교가 가능한 질문' },
    { age: 11, label: '11세', name: '용후', description: '반성과 추론이 가능한 질문' },
  ];

  const handleSelect = (ageGroup: AgeGroup) => {
    const name = ageOptions.find(opt => opt.age === ageGroup)?.name || '';
    onSelect(ageGroup, name);
  };

  return (
    <div className="bg-white rounded-airbnb-lg shadow-airbnb-lg p-12 max-w-xl mx-auto border border-airbnb-gray-100">
      <h2 className="text-4xl font-semibold text-airbnb-dark mb-10 text-center tracking-tight">
        누구의 질문을 시작할까요?
      </h2>
      
      <div className="space-y-5">
        {ageOptions.map((option) => (
          <button
            key={option.age}
            onClick={() => handleSelect(option.age)}
            className="w-full text-left p-7 rounded-airbnb-lg border border-airbnb-gray-200 hover:border-airbnb-coral hover:shadow-airbnb-lg transition-all group bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-2xl text-airbnb-dark group-hover:text-airbnb-coral transition-colors mb-2">
                  {option.name} ({option.label})
                </div>
                <div className="text-base text-airbnb-gray-400 font-light">
                  {option.description}
                </div>
              </div>
              <div className="text-airbnb-gray-300 text-3xl group-hover:text-airbnb-coral group-hover:translate-x-2 transition-all">
                →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}



