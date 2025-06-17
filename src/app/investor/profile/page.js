import ProfileHeaderCard from "@/components/investor/profile/ProfileHeaderCard";
import PersonalInfoCard from "@/components/investor/profile/PersonalInfoCard";
import InvestmentProfileCard from "@/components/investor/profile/InvestmentProfileCard";

export default function InvestorProfilePage() {
  return (
    <div className=" mx-auto">
      <ProfileHeaderCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PersonalInfoCard />
        <InvestmentProfileCard />
      </div>
    
    </div>
  );
}