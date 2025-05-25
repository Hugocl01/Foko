import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import PlanTabs from '@/components/plan-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configuración de plan', href: '/settings/plan' },
];

export default function PlanSettings() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de plan" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Configuración de plan"
                        description="Actualiza el plan de tu cuenta"
                    />
                    <PlanTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
