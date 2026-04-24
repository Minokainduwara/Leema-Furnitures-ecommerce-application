import Header from "../components/Header";
import Body from "../components/Body";
import Footer from "../components/Footer";
import Product from "../components/Product";


function Home() {
  return (
    <div>
      <Header />
      <Body>
        <div className="bg-rose-50 min-h-100bg-gradient-to-b from-rose-50 to-white py-16 px-5 md:px-10">
          <div>
            <h4 className="font-extrabold text-4xl md:text-5xl font-sans text-center p-3 text-gray-800 mb-8 relative inline-block">
              OUR PRODUCT
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-24 h-1 bg-orange-500 rounded-full"></span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 p-10">
              {Product.map(function (item) {
                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl flex flex-col items-center gap-3 shadow-lg hover:shadow-2xl transition duration-500 hover:-translate-y-3 hover:scale-105"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-44 h-44 object-cover rounded-xl shadow-md hover:scale-110 transition duration-500"
                    />
                    <h4 className="text-lg md:text-xl font-bold  text-gray-800">{item.name}</h4>
                    <p className="text-sm md:text-base  text-gray-500 font-medium">
                      {item.price}
                    </p>
                  </div>
                );
              })}
            </div>
            <h4 className="font-extrabold text-4xl  md:text-5xl font-sans text-center p-3 text-gray-800 mt-20 relative inline-block">
              OUR BRANDS
               <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-24 h-1 bg-orange-500 rounded-full"></span>
            </h4>
          </div>
        </div>
      </Body>
      <Body>
       <div>
       <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 min-h-20 flex justify-around items-center text-white p-4 rounded-lg shadow-lg ">
       <div className="text-lg font-bold hover:text-orange-400 ">SUPER MAX</div>
       <div className="text-lg font-bold hover:text-orange-400 ">TEKA</div>
       <div className="text-lg font-bold hover:text-orange-400 ">FLEX</div>
       </div>

       <div className="bg-linear-to-r from-orange-400 via-orange-300 to-orange-200 min-h-175 flex flex-col md:flex-row justify-around items-center gap-y-10 p-10 relative overflow-hidden">
        <div className="gap-3 justify-center flex flex-col items-start max-w-md">
        <h2 className="text-4xl  md:text-5xl font-bold text-white pt-2 pl-4">Our Services</h2>
        <h6 className="text-white  text-lg md:text-xl font-medium pt-2 pl-4">We provide high-quality, stylish,and </h6>
         <h6 className="text-white  text-lg md:text-xl font-medium  pl-4">  durable furniture with reliable delivery</h6> 
         <h6 className="text-white text-lg md:text-xl font-medium  pl-4">  and excellent customer service  to</h6>
          <h6 className="text-white  text-lg md:text-xl font-medium  pl-4">
           make your home comfortable and beautiful</h6>
           <div className="mt-6 pl-4 ">
            <img src="/images/services.jpg" alt="service" className="w-75 h-87.5 object-cover rounded-xl shadow-xl hover:scale-105 transition duration-500 justify-center"/>
           </div>
        </div>

        <div className="w-100 grid sm:grid-cols-1   md:grid-cols-2  gap-6 justify-center">

         <div className="bg-white  font-semibold rounded-3xl p-5 w-50 h-50 shadow-lg hover:shadow-2xl font-sans  text-center flex flex-col justify-center items-center ">
         <h3 className=" text-5xl animate-bounce">🪑</h3>
         <h3 className="font-bold text-lg md:text-xl">Free Delivery</h3>
         <p className="text-sm md-text-base text-gray-500">Fast and safe delivery to your home.</p>
         </div>


         <div className="bg-white  font-semibold rounded-3xl p-5 w-50 h-50 shadow-lg hover:shadow-2xl font-sans  text-center flex flex-col justify-center items-center ">
         <h3 className=" text-5xl animate-bounce" >🛠️</h3>
         <h3 className="font-bold text-lg md:text-xl">Custom Design</h3>
         <p className="text-sm md-text-base text-gray-500">Furniture designed for your space.</p>
         </div>
         <div className="bg-white  font-semibold rounded-3xl p-5 w-50 h-50 shadow-lg hover:shadow-2xl font-sans  text-center flex flex-col justify-center items-center ">
          <h3 className=" text-5xl animate-bounce">🧰</h3>
         <h3 className="font-bold text-lg md:text-xl">Installation</h3>
         <p className="text-sm md-text-base text-gray-500">Professional furniture setup service.</p>
         </div>
         <div className="bg-white  font-semibold rounded-3xl p-5 w-50 h-50 shadow-lg hover:shadow-2xl font-sans  text-center flex flex-col justify-center items-center ">
          <h3 className=" text-5xl animate-bounce">🔧</h3>
         <h3 className="font-bold text-lg md:text-xl">Repair Service</h3>
         <p className="text-sm md-text-base text-gray-500">Reliable furniture repair support.</p></div>
       </div>
       
       </div>
       </div>

      </Body>

      <Footer />
    </div>
  );
}

export default Home;
