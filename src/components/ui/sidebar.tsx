import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-64 h-screen bg-white border-r", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

interface SidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SidebarButton = React.forwardRef<HTMLButtonElement, SidebarButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SidebarButton.displayName = "SidebarButton";

interface SidebarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const SidebarLink = React.forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);
SidebarLink.displayName = "SidebarLink";

export { Sidebar, SidebarButton, SidebarLink };