import { ScrollTopButton } from "@/components/ScrollTopButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export function FloatingActions() {
  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-center gap-2">
      <ScrollTopButton />
      <ThemeToggle />
    </div>
  );
}
