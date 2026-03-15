import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ChevronDown } from "lucide-react";
import { ForgeHammer } from "@/components/forge-hammer";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav
      aria-label="Main navigation"
      className="h-16 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2 text-[15px] font-semibold text-[#FAFAFA] hover:text-white transition-colors duration-150"
          >
            <ForgeHammer size={20} className="text-[#F97316]" />
            MCPForge
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-[13px] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors duration-150"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] text-[#FAFAFA] hover:bg-[#27272A] transition-colors duration-150 focus:outline-none">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] font-mono text-[12px] font-bold text-white">
                  {user.name?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <span className="hidden sm:inline">
                  {user.name || user.email}
                </span>
                <ChevronDown className="h-3 w-3 text-[#71717A]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#18181B] border-white/[0.06]"
              >
                <div className="px-3 py-2">
                  {user.name && (
                    <p className="text-[13px] font-medium text-[#FAFAFA]">
                      {user.name}
                    </p>
                  )}
                  <p className="text-[12px] text-[#A1A1AA]">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/auth/signin" });
                  }}
                >
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[13px] text-[#FAFAFA] hover:bg-[#27272A] transition-colors duration-150"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="rounded-md px-3 py-1.5 text-[13px] text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-[#F97316] px-3 py-1.5 text-[13px] font-medium text-black hover:bg-[#EA580C] transition-colors duration-150"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
