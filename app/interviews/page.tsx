import RecruiterInterviews from "../../Components/recruiter/RecruiterInterviews";
import { RecruiterInternshipProvider } from "../../Components/context/RecruiterInternshipContext";

export default function InterviewsPage() {
  return (
    <RecruiterInternshipProvider>
      <RecruiterInterviews />
    </RecruiterInternshipProvider>
  );
}