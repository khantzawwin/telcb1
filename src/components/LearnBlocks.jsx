// Presentational blocks for the Learn / Reference sections of drill pages.

export function SectionCard({ num, title, formula, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-start gap-3 mb-4">
        {num && (
          <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold mt-0.5">
            {num}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 leading-snug">{title}</h2>
          {formula && (
            <p className="mt-1 inline-block text-sm font-mono font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {formula}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export function MiniTable({ head, rows }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2.5 border border-gray-200 text-left font-semibold text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className={`px-3 py-2.5 border border-gray-200 text-gray-700 ${ci === 0 ? 'font-semibold text-gray-900 whitespace-nowrap' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Ex({ de, en }) {
  return (
    <div className="border-l-4 border-indigo-200 pl-4 py-1 my-2">
      <p className="text-base text-gray-900 font-medium">{de}</p>
      <p className="text-sm text-gray-500">{en}</p>
    </div>
  )
}
