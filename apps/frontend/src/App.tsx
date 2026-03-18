
import UserDashboard from './pages/UserDashboard.tsx'
function App() {

  return (
    <>
   <UserDashboard/>
    </>
  )
}

export default App

// import React from 'react';
// import { Button } from '@/components/ui/button';

// export default function Navbar() {
//   return (
//     <nav className="bg-[#8BA89A] px-8 py-4">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center">
//           <div className="bg-[#E84545] px-6 py-2 rounded">
//             <span className="text-white font-bold text-2xl italic">Leema</span>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex items-center gap-8">
//           <a href="#home" className="text-white hover:text-gray-100 transition-colors">
//             Home
//           </a>
//           <a href="#product" className="text-white hover:text-gray-100 transition-colors">
//             Product
//           </a>
//           <a href="#contact" className="text-white hover:text-gray-100 transition-colors">
//             Contact us
//           </a>
//           <a href="#service" className="text-white hover:text-gray-100 transition-colors">
//             service
//           </a>
//         </div>

//         {/* Auth Buttons */}
//         <div className="flex items-center gap-4">
//           <Button 
//             variant="ghost" 
//             className="text-white hover:bg-white/10 hover:text-white"
//           >
//             login
//           </Button>
//           <Button 
//             variant="ghost" 
//             className="text-white hover:bg-white/10 hover:text-white"
//           >
//             sign in
//           </Button>
//         </div>
//       </div>
//     </nav>
//   );
// }