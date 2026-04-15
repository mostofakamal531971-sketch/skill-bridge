
const UserWelcome = ({name}:{name:string}) => {
    
  return (
         <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}! 👋</h1>
            <p className="text-zinc-500">You have 2 sessions scheduled for today.</p>
          </div>
  )
}

export default UserWelcome
