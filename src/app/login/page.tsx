import React, { Suspense } from 'react'

import Loading from '@/components/Loading'
import LoginComponent from '@/components/LoginComponent'

export default function Login() {
  return (
    <>
    <Suspense fallback={<Loading />}>
      <LoginComponent />
    </Suspense>
    </>
  )
}
