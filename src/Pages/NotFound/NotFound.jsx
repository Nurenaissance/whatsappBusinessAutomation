import notfound from "../../assets/notfound.webp"

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{width:'98.9vw', height:'80vh'}}>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto rounded-lg flex items-center justify-center">
            <span className=" text-lg"><img src={notfound} alt="" /></span>
          </div>
        </div>
        <a href="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
          Go Home
        </a>
      </div>
    </div>
  );
};