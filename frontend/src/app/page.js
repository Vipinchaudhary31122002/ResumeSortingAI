export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form className="flex flex-col gap-4 p-8 rounded-2xl w-full max-w-md outline">
        <label className="flex flex-col">
          <span className="mb-1 text-2xl">Job Title</span>
          <input
            type="text"
            placeholder="Enter job title"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 text-2xl">Job Description</span>
          <textarea
            placeholder="Enter job description"
            rows={5}
            className="border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 text-2xl">Upload ZIP File</span>
          <input
            type="file"
            accept=".zip"
            className="file:border file:border-gray-300 file:rounded-lg file:px-4 file:py-2 file:bg-white file:text-gray-700"
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white text-2xl py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
