import React, { useState } from "react";
import { Link } from "react-router-dom";

function SellerMessage() {
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      customer: "Nimal Perera",
      message: "Is this sofa available in brown color?",
      reply: "",
    },
    {
      id: 2,
      customer: "Kamal Silva",
      message: "Do you deliver to Kandy?",
      reply: "",
    },
    {
      id: 3,
      customer: "Saman Kumara",
      message: "What is the warranty for this bed?",
      reply: "",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const sideBarItems = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];
  return (
    <div
      className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}
    >
      <aside
        className={`bg-white w-64 h-screen dark:bg-gray-900 fixed shadow-lg border-r border-gray-200 dark:border-gray-800 z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
          <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Seller Dashboard
          </span>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setsidebar(false)}
          >
            <img src="/images/close.png" alt="close" className="h-8 w-8 p-1" />
          </button>
        </div>
        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path!}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition font-medium mb-2"
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 mt-2">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition">
            Logout
          </button>
        </div>
        <div className="mt-auto flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setdarkmode(!darkmode)}
            aria-label="Toggle dark mode"
          >
            {darkmode ? (
              <img src="/images/moon.png" alt="moon" className="w-6 h-6" />
            ) : (
              <img src="/images/sun.png" alt="sun" className="w-6 h-6" />
            )}
          </button>
        </div>
      </aside>
      <main
  className={`flex-1 h-screen overflow-hidden  ${
    darkmode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
  }`}
>
  
  <div className="px-6 py-5  bg-white dark:bg-gray-900 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold">Messages 💬</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Manage customer inquiries and replies
      </p>
    </div>

    <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
      {messages.length} Conversations
    </div>
  </div>

  
  <div className="flex h-[calc(100%-80px)]">

    
    <div className="w-1/3 bg-white dark:bg-gray-900 border-r overflow-y-auto mt-4 ml-4 mb-4 shadow-lg rounded-lg">
      <div className="p-3 border-b text-xs text-gray-500 uppercase">
        Inbox
      </div>

      {messages.map((msg) => (
        <div
          key={msg.id}
          onClick={() => {
            setSelectedMessage(msg);
            setReplyText(msg.reply);
          }}
          className={`p-4 cursor-pointer transition border-b hover:bg-gray-100 dark:hover:bg-gray-800 ${
            selectedMessage?.id === msg.id
              ? "bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500"
              : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="font-semibold">{msg.customer}</p>

            {msg.reply ? (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Replied
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 truncate mt-1">
            {msg.message}
          </p>
        </div>
      ))}
    </div>

    
    <div className="flex-1 p-6 overflow-y-auto">
      {!selectedMessage ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <div className="text-6xl mb-3">💬</div>
          <p className="text-lg font-semibold">Select a message</p>
          <p className="text-sm">View customer inquiry details here</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">

        
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-5 mb-4">
            <h3 className="text-lg font-bold">
              {selectedMessage.customer}
            </h3>
            <p className="text-sm text-gray-500">Customer Inquiry</p>
          </div>

          
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl mb-4">
            <p>{selectedMessage.message}</p>
          </div>

        
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <p className="text-sm font-semibold mb-2">Your Reply</p>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response..."
              className="w-full border rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-400 outline-none"
              rows={4}
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === selectedMessage.id
                        ? { ...m, reply: replyText }
                        : m
                    )
                  );
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              >
                Send Reply
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  </div>
</main>
    </div>
  );
}

export default SellerMessage;
