
function Footer() {
  return (
    <div className="bg-gray-900  text-gray-300  ">
        <div className="grid grid-cols-3 gap-8  p-5">
      <div className="border-r border-gray-700">
        <h4 className="text-lg font-semibold mb-3 text-yellow-400">CATEGORIES</h4>
        <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer"><a>Wood Furniture</a></li>
            <li className="hover:text-white cursor-pointer"><a>Plastic Furniture</a></li>
            <li className="hover:text-white cursor-pointer"><a >Steel Fabricated Furniture</a></li>
            <li className="hover:text-white cursor-pointer"><a></a></li>
          </ul>
         
      </div>
      <div className="border-r border-gray-700">
        <h4 className="text-lg font-semibold mb-3 text-yellow-400">OUR COMPANY</h4>
        <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer"><a>Home</a></li>
            <li className="hover:text-white cursor-pointer"><a>Contact us</a></li>
            <li className="hover:text-white cursor-pointer"><a>About</a></li>
            <li className="hover:text-white cursor-pointer"><a>Terms & Conditions</a></li>
          </ul>
      </div>
      <div className="border-r border-gray-700">
        <h4 className="text-yellow-400 text-lg font-semibold mb-3">VISIT OUR SHOWROOMS</h4>
        <div className="flex justify-around items-center">
          <div >
<div className="flex items-center gap-2 text-sm mb-1 mr-px">
  <img src="/images/location.png" alt="Showroom 2" className="w-3 h-3 rounded-lg" />
  <span>123/A, Main Street, Kegalle</span>

</div>       

<div className="flex items-center gap-2 text-sm mb-1">
  <img src="/images/email.png" alt="Showroom 2" className="w-3 h-3 rounded-lg" />
  <span>leemakegalle@gmail.com</span>
</div>
<div className="flex items-center gap-2 text-sm mb-1">
  <img src="/images/phone2.png" alt="Showroom 2" className="w-3 h-3 rounded-lg" />
  <span>+94 77 1234567</span>
</div>
</div>
<div>
<div className="flex items-center gap-2 text-sm mb-1">
  <img src="/images/location.png" alt="Showroom 2" className="w-3 h-3 rounded-lg" />
  <span>No 24,Nuwaraeliya Rd,Gampola</span>
</div>
<div className="flex items-center gap-2 text-sm mb-1">
  <img src="/images/email.png" alt="Showroom 2" className="w-3 h-3 rounded-lg" />
  <span>leemagampola@gmail.com</span>
</div>
<div className="flex items-center gap-2 text-sm mb-1">
  <img src="/images/phone2.png" alt="Showroom 2" className="w-3 h-3 rounded-lg" />
  <span>+94 77 8424567</span>
</div>
        </div>
        </div>
         <div className="flex gap-4 mt-4 pl-4">  
        <a className="hover:text-white cursor-pointer">Facebook</a>
        <a className="hover:text-white cursor-pointer">Instergram</a>
        <a className="hover:text-white cursor-pointer">Twitter</a>
        </div>
      </div>
      </div>
      <div className="border-t border-gray-700 text-center text-sm p-4">
        © 2026 Furniture Store. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
