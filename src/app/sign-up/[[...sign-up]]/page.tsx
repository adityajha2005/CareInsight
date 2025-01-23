import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold mb-4">Create an Account</h1>
      <SignUp />
    </div>
  );
}