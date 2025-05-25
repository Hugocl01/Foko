import { useState, useEffect, FormEventHandler } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import DeleteUser from '@/components/delete-user';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

type SharedData = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            description: string;
            profile_image_url: string | null;
        };
    };
    flash: { success?: string; error?: string };
};

export default function Profile() {
    // 1) Sacamos el usuario de Inertia
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // 2) Estado del formulario con Inertia
    const { data, setData, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        description: user.description || '',
        profile_image: null as File | null,
    });

    // 3) Estado para la URL de preview
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.profile_image_url);

    // 4) Cuando cambie `profile_image` en `data`, creamos una URL temporal
    useEffect(() => {
        if (data.profile_image) {
            const url = URL.createObjectURL(data.profile_image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        // si quita la selección, volvemos al avatar original del servidor
        setPreviewUrl(user.profile_image_url);
    }, [data.profile_image, user.profile_image_url]);

    // 5) Al enviar, forzamos FormData para incluir la imagen
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(
            route('profile.update'),
            {
                _method: 'patch',
                ...data,
            },
            {
                forceFormData: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Configuración de perfil', href: '/settings/profile' }]}>
            <Head title="Configuración de perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Información de perfil" description="Actualiza tus datos y tu imagen de perfil" />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Avatar + Input file */}
                        <div className="grid gap-2">
                            <Label>Imagen de perfil</Label>
                                <Avatar className="h-32 w-32">
                                    {previewUrl ? (
                                        <AvatarImage src={previewUrl} alt="Avatar actual" />
                                    ) : (
                                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    )}
                                </Avatar>
                                <Input
                                    id="profile_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('profile_image', e.currentTarget.files?.[0] ?? null)}
                                />
                            <InputError message={errors.profile_image} />
                        </div>

                        {/* Nombre */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Nombre completo"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Correo */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="tu@ejemplo.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Descripción */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Cuéntanos algo sobre ti"
                                maxLength={255}
                            />
                            <InputError message={errors.description} />
                        </div>

                        {/* Botón Guardar */}
                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar</Button>
                            {recentlySuccessful && <span className="text-sm text-green-600">Guardado</span>}
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
