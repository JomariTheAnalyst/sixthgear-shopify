export default function ProfileLoading() {
  return (
    <div className="w-full animate-pulse" data-testid="profile-skeleton">
      {/* Page Title */}
      <div className="h-8 w-28 bg-gray-100 rounded-lg mb-6" />

      {/* Form Fields */}
      <div className="space-y-6 max-w-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
            <div className="h-12 w-full bg-gray-100 rounded-xl" />
          </div>
        ))}

        {/* Submit Button */}
        <div className="h-12 w-full bg-gray-100 rounded-xl" />
      </div>
    </div>
  )
}
