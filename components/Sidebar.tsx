"use client";
import { cn } from "@/lib/utils";
import {
  IconCircleDashedCheck,
  IconFolderPlus,
  IconInfoHexagon,
  IconLayoutDashboard
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SidebarBody, SidebarLink, SidebarUi } from "./ui/sidebar";

export function Sidebar() {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false); // Close the sidebar
  };

  const links = [
    {
      label: "Home",
      href: "/", 
      icon: (
        <IconFolderPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Details",
      href: "/invoices",
      icon: (
        <IconInfoHexagon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Delivered",
      href: "/delivered", // Updated path
      icon: (
        <IconCircleDashedCheck className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "DashBoard",
      href: "#", // Updated path
      icon: (
        <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <SidebarUi open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={handleLinkClick} // Close sidebar on click
                >
                  <SidebarLink link={link} />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <Link href="/" onClick={handleLinkClick}> 
              <SidebarLink
                link={{
                  label: "Amruth L P",
                  href: "/",
                  icon: (
                    <Image
                      src="/profile.svg"
                      className="h-7 w-7 flex-shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </Link>
          </div>
        </SidebarBody>
      </SidebarUi>
    </div>
  );
}

export const Logo = () => {

  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false); // Close the sidebar
  };

  return (
    <Link
    onClick={handleLinkClick}
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Sumithra Ladies Tailor
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
