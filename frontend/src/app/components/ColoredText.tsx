export function ColoredText() {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-3xl font-bold text-indigo-600">Main Heading</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Regular paragraph text
        </p>
        <button className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
          Click Me
        </button>
        <div className="text-[#FF6B6B]">
          Custom coral-colored text
        </div>
      </div>
    )
  }