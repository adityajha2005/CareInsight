import EmergencyContacts from '@/components/Help'

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Emergency Contacts
        </h1>
        <EmergencyContacts />
      </div>
    </main>
  )
}
