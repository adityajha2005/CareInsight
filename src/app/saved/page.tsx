import { SavedResults } from '@/components/SavedResults'

export default function page() {
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <SavedResults />
      </div>
    </main>
  )
}
