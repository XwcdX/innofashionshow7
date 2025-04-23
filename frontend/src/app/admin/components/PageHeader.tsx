const PageHeader = ({ title }:{ title:string}) => {
    return (
      <div className="xl:w-10/12 w-full flex justify-center md:block md:ms-60 lg:ms-60 xl:ms-60">
        <div className="flex flex-col justify-center mx-auto md:rounded-b-full rounded-3xl shadow-2xl px-12">
          <h1 className="typewriter lg:text-5xl md:text-4xl text-lg py-5 font-bold bg-black bg-clip-text text-transparent text-center">
            {title}  {/* Dynamically rendered title */}
          </h1>
        </div>
      </div>
    );
  };
  
  export default PageHeader;