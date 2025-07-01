import Auth from "@/components/auth";

export default async function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Auth providers={["github", "roblox"]}/>
      </div>
    </div>
  );
}
