'use client';

import Requirements from '@/app/components/requirements';
import ClientsTableWithPagination from '@/app/components/ClientsTableWithPagination';

export default function ClientManagement() {
    return (
        <Requirements>
            <ClientsTableWithPagination />
        </Requirements>
    )
}
