export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-[3px] border-gray-200 border-t-[#8015e8] animate-spin"
        />
      </div>
    </div>
  )
}
