import InternshipApplicants from "../../../Components/internships/InternshipApplicants";
import { RecruiterInternshipProvider } from "../../../Components/context/RecruiterInternshipContext";

export default function InternshipApplicantsPage() {
  return (
    <RecruiterInternshipProvider>
      <InternshipApplicants />
    </RecruiterInternshipProvider>
  );
}