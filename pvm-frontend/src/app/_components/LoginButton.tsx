"use client";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginButton() {
  const { isAuthenticated, user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <Button isLoading>Loading...</Button>;
  }

  if (isAuthenticated && user) {
    return (
      <Dropdown
        classNames={{
          content: "bg-neutral-800 border border-gray-700 min-w-[200px]",
        }}
      >
        <DropdownTrigger>
          <Button variant="bordered" className="border-gray-700">
            {user.name}
            {user.role === "admin" && (
              <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                Admin
              </span>
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User actions"
          classNames={{
            base: "bg-neutral-800",
          }}
        >
          <DropdownItem key="info" isReadOnly className="opacity-100">
            <p className="text-sm text-white">{user.name}</p>
            <p className="text-xs text-gray-400">
              {user.role === "admin" ? "Administrator" : "User"}
            </p>
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            className="text-danger"
            onPress={logout}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button onClick={login} color="default">
      Login with Trackmania
    </Button>
  );
}