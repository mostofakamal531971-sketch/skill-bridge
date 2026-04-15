import App from "@/components/shared/VideoCall";


const page =async ({params}:{params:{id:string}}) => {
  const {id} = await params;


  const userId = "user_123";
  const userName = "Habib";

  if (!id) return <div>Loading...</div>;
return <App/>
}

export default page