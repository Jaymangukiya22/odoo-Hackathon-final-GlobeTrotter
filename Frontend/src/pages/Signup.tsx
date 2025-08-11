import { SignupForm } from "@/components/signup-form";

const Signup = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
