// eslint-disable-next-line react/prop-types
function Loading({ text }) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="mt-4 text-white text-lg font-semibold">
          {text ? text : "Loading..."}
        </p>
      </div>
    );
  }
  
  export default Loading;
  