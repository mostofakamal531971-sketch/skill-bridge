import { getProfile } from '@/features/auth/services'
import TutorProfilePage from '@/features/tutor/components/ProfileDetails';
import React from 'react'

const TutorDashboardProfile = async () => {
const userData = await getProfile();

console.log(userData?.user.data);

  return (
    <div>
      <TutorProfilePage tutor={userData?.user.data as any}/>
    </div>
  )
}

export default TutorDashboardProfile
