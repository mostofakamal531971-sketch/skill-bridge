

import AdminOverview from "@/features/admin/components/AdminOverview";
import { getAdminDashboardData } from "@/services/admin.services";


const OverviewPage = async() => {

  const data = await getAdminDashboardData()

  return (
    <div className="p-6 md:p-10 space-y-12  transition-colors duration-500">

      <AdminOverview data={data.data}/>

     
    </div>
  );
};

export default OverviewPage;
