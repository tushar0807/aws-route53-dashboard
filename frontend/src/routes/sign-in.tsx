import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <main style={{display : 'flex' , justifyContent : 'center' , marginTop : '48px'}}>
      <SignIn />
    </main>
  );
}
