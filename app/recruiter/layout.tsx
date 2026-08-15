import { RecruiterInternshipProvider } from "../@/context/RecruiterInternshipContext";
import { InterviewProvider } from "@/context/interviews";
export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecruiterInternshipProvider>
      <InterviewProvider>
        {children}
      </InterviewProvider>
    </RecruiterInternshipProvider>
  );
}