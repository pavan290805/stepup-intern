import { RecruiterInternshipProvider } from "../@/context/RecruiterInternshipContext";
import { InterviewProvider } from "@/context/interviews";
import RecruiterInterviews from "@/components/recruiter/RecruiterInterviews";

export default function Page() {
  return (
    <RecruiterInternshipProvider>
      <InterviewProvider>
        <RecruiterInterviews />
      </InterviewProvider>
    </RecruiterInternshipProvider>
  );
}