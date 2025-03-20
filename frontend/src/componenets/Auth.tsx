export const Auth = ({type}: {type: "signup" | "signin" })=>{
    return <div className="bg-slate-200 h-screen flex justify-center flex-col">
        
        <div>
            <div className="text-3xl font-extrabold">
                    Create an Account
            </div>  
            <div className="text-slate-400">
                    Already have an account? 
                    <Link className="pl-2 underline" to={"/signin"}> Login </Link>
            </div>
        </div>
    </div>
}