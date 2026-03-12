interface SidebarItem {
    name: string;
    path: string;
  }
  
  const menuItems: SidebarItem[] = [
    { name: "My Details", path: "/details" },
    { name: "Add User", path: "/add-user" },
    { name: "Add Product", path: "/add-product" },
  ];
  
  export default function Sidebar() {
    return (
      <div className="w-72 bg-[#3e5f5a] min-h-screen p-6 text-white">
        <h1 className="text-xl font-semibold mb-8">ADMIN DASHBOARD</h1>
  
        {menuItems.map((item) => (
          <button
            key={item.name}
            className="w-full bg-gray-200 text-gray-700 rounded-xl py-3 mb-4 hover:bg-gray-300 transition"
          >
            {item.name}
          </button>
        ))}
      </div>
    );
  }