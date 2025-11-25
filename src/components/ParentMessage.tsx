export default function ParentMessage() {
  return (
    <div className="bg-airbnb-light rounded-airbnb-lg shadow-airbnb p-8 border border-gray-200">
      <div className="flex items-start space-x-5">
        <div className="text-5xl">💝</div>
        <div className="flex-1">
          <h4 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
            부모님께
          </h4>
          <p className="text-gray-700 text-lg leading-relaxed mb-2 font-light">
            "너의 생각과 감정을 말해줘서 고맙다.
          </p>
          <p className="text-gray-900 text-lg leading-relaxed font-semibold">
            너는 계속 자라고 있어."
          </p>
        </div>
      </div>
    </div>
  );
}



