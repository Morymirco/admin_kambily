import Dashboard from "@/app/admin/page";
import LoginProvider from "@/app/context/LoginContext";

export default function Home() {
  return (
      <LoginProvider>
          <Dashboard></Dashboard>
      </LoginProvider>
  );
}
