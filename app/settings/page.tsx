import { Settings as SettingsIcon } from "lucide-react";
import SettingsPanel from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <span className="eyebrow flex items-center gap-1.5">
            <SettingsIcon size={13} /> Preferences
          </span>
          <h1 className="font-display text-3xl tracking-wide">Settings</h1>
          <p className="mt-1 text-sm text-mist-500">
            Customize appearance, AI model behavior, and manage your local data.
          </p>
        </div>
        <SettingsPanel />
      </div>
    </div>
  );
}
