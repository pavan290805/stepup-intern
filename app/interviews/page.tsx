import { RecruiterInternshipProvider } from "../../Components/context/RecruiterInternshipContext";
import { InterviewProvider } from "../../Components/context/interviews";
import RecruiterInterviews from "../../Components/recruiter/RecruiterInterviews";

export default function Page() {
  return (
    <RecruiterInternshipProvider>
      <InterviewProvider>
        <RecruiterInterviews />
      </InterviewProvider>
    </RecruiterInternshipProvider>
  );
}