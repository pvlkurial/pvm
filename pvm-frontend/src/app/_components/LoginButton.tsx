"use client";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_BADGE_CLASSES,
} from "@/constants/roles";

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
          <button className="hover:border-gray-700 hover:bg-neutral-700 text-label py-2 rounded px-4 cursor-pointer rounded-lg duration-200">
            {user.name}
            {ROLE_BADGE_CLASSES[user.role] && (
              <span
                className={`ml-2 text-xs px-2 py-1 rounded ${ROLE_BADGE_CLASSES[user.role]}`}
              >
                {ROLE_LABELS[user.role]}
              </span>
            )}
          </button>
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
              {ROLE_DESCRIPTIONS[user.role] ?? ROLE_DESCRIPTIONS.user}
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
