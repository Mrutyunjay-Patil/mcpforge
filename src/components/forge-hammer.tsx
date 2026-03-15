import { Hammer } from "lucide-react";
import { type ComponentProps } from "react";

export function ForgeHammer({
  size = 24,
  ...props
}: ComponentProps<typeof Hammer>) {
  return <Hammer size={size} {...props} />;
}
