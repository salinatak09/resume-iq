import AuthTabs from "@/components/AuthTabs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AuthLayout = async ({children}:LayoutProps<"/auth">) => {
  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
  });

  if(session){
    redirect('/dashboard');
  }
  return (
    <>
      <AuthTabs/>
      {children}
    </>
  )
}

export default AuthLayout;