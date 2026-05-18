'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const roles = [
  { value: 'brand', label: 'Brand' },
  { value: 'creator', label: 'Creator' },
  { value: 'agency', label: 'Agency' },
  { value: 'admin', label: 'Admin' },
];

export function RoleSelect({ value, onChange, includeAdmin = false }) {
  const options = includeAdmin ? roles : roles.filter((r) => r.value !== 'admin');

  return (
    <div className="space-y-2">
      <Label>I am a</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {options.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
