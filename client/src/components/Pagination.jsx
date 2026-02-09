export default function Pagination({
  pageData,
  limit,
  onPageChange,
  onLimitChange,
}) {
  if (!pageData) return null;

  const {
    currentPage,
    previousPage,
    nextPage,
    hasNextPage,
    lastPage,
  } = pageData;

  return (
    <div className="mt-6 flex flex-col gap-4">

      {/* Limit Selector */}
      <div className="flex items-center gap-2 text-gray-300">
        <label>Expenses per page:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="bg-gray-700 p-2 rounded"
        >
          {[5, 7, 9, 11, 13].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Page Buttons */}
      <div className="flex gap-2 items-center">

        {previousPage && (
          <button
            onClick={() => onPageChange(previousPage)}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            {previousPage}
          </button>
        )}

        <button className="px-3 py-1 bg-blue-600 text-white rounded">
          {currentPage}
        </button>

        {hasNextPage && (
          <button
            onClick={() => onPageChange(nextPage)}
            className="px-3 py-1 bg-gray-600 text-white rounded"
          >
            {nextPage}
          </button>
        )}

        <span className="text-gray-400 ml-2">
          / {lastPage}
        </span>
      </div>
    </div>
  );
}
