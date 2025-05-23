export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    profile_image_url: string | null;
    status: number;
    plan_id: number | null;
    role_id: number;
    description: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}
