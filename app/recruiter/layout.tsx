import { RecruiterInternshipProvider } from "../../Components/context/RecruiterInternshipContext";
import { InterviewProvider } from "../../Components/context/interviews";
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