import Image from "next/image";
import Landing from "@/app/providers/authContext";
import Dashboard from "@/app/admin/page";

export default function Home() {
  return (
    <Landing>
      <Dashboard/>
    </Landing>
  );
}
