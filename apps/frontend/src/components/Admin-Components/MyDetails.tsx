export default function MyDetails() {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10">

      <h2 className="text-2xl font-semibold mb-8 text-gray-700">
        My Details
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#b07b44]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#b07b44]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Organization</label>
          <input
            type="text"
            placeholder="Organization name"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#b07b44]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Department</label>
          <input
            type="text"
            placeholder="Department"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#b07b44]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Work Phone</label>
          <input
            type="text"
            placeholder="+94"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#b07b44]"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Start Date</label>
          <input
            type="date"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#b07b44]"
          />
        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <button className="bg-[#b07b44] text-white px-6 py-3 rounded-lg hover:scale-105 hover:shadow-lg transition duration-300">
          Save Details
        </button>

      </div>

    </div>
  );
}