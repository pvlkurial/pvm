import { Role } from "@/types/auth";
import { ROLES, ROLE_LABELS } from "@/constants/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectProps {
  value: Role;
  onChange: (role: Role) => void;
  playerName: string;
  disabled?: boolean;
}

export function RoleSelect({ value, onChange, playerName, disabled }: RoleSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(role) => role !== value && onChange(role as Role)}
      disabled={disabled}
    >
      <SelectTrigger aria-label={`Role for ${playerName}`} className="h-8 w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
