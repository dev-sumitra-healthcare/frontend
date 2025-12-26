import { AdminRegistrationForm } from "@/components/AdminRegistrationForm";

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Bootstrap
          </h1>
          <p className="text-gray-600">
            Create the first administrator account to get started
          </p>
        </div>
        <AdminRegistrationForm />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            This page is only available when no admin accounts exist
          </p>
        </div>
      </div>
    </div>
  );
}
