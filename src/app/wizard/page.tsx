import type { Metadata } from "next";
import ProjectWizard from "@/components/wizard/ProjectWizard";

export const metadata: Metadata = {
  title: "ابدأ مشروعك | Seymour Soft Solution",
  description: "أخبرنا عن مشروعك وهنتواصل معاك في أقل من ٢٤ ساعة",
};

export default function WizardPage() {
  return <ProjectWizard />;
}
