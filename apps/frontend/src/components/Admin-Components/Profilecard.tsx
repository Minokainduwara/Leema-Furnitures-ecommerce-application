import React from "react";

const ProfileCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      
      <h2 className="text-xl font-semibold mb-6">Work</h2>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="text-sm text-gray-500">Organization</label>
          <input
            className="border w-full p-2 rounded mt-1"
            defaultValue="StiltSoft Development Inc"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Department</label>
          <input
            className="border w-full p-2 rounded mt-1"
            defaultValue="RnD Department"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Started Work</label>
          <input
            type="date"
            className="border w-full p-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Work Phone</label>
          <input
            className="border w-full p-2 rounded mt-1"
            defaultValue="+1 800 656 5656"
          />
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;