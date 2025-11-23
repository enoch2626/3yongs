export default function ParentMessage() {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl shadow-lg p-8 border-l-4 border-primary-500">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">💝</div>
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">
            부모님께
          </h4>
          <p className="text-gray-700 text-lg leading-relaxed mb-2">
            "너의 생각과 감정을 말해줘서 고맙다.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed font-semibold">
            너는 계속 자라고 있어."
          </p>
        </div>
      </div>
    </div>
  );
}

