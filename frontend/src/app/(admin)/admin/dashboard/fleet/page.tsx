import React from 'react';
import { AdminFleetDispatch } from '@/components/admin/AdminFleetDispatch';

export default function AdminFleetPage() {
  return (
    <div className="py-6 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 w-full max-w-[1720px] mx-auto space-y-6">
      <AdminFleetDispatch />
    </div>
  );
}
