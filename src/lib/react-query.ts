import { useQueryClient } from "@tanstack/react-query"

export const useRefetchQueries = () =>{
     const queryClient = 
      useQueryClient()
  

const refetchQueries = async(...keys:string[])=>{
      await Promise.all(keys.map((key)=> queryClient.invalidateQueries({
    queryKey:[key]
  })))
}
return {refetchQueries}
}
