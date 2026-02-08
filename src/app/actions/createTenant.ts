'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';

export async function createTenant(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const phone_number = formData.get('phone_number') as string;
    const house_id = formData.get('house_id') as string;

    if (!name || !phone_number || !house_id) {
        return { error: "Name, Phone, and House are required." };
    }

    // Auto-generate dummy credentials for "Shadow Auth"
    const cleanPhone = phone_number.replace(/\D/g, '');
    const dummyEmail = `tenant_${cleanPhone}_${Date.now()}@siddharthacolony.local`;
    const dummyPassword = `Ten@${cleanPhone}!${Math.floor(Math.random() * 1000)}`;

    try {
        // 1. Create Auth User
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: dummyEmail,
            password: dummyPassword,
            email_confirm: true,
            user_metadata: { name, phone_number, is_shadow_account: true }
        });

        if (authError) throw authError;
        if (!authUser.user) throw new Error("Failed to create auth user");

        // 2. Create Public User Profile
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .insert([{
                id: authUser.user.id,
                email: dummyEmail,
                role: 'tenant', // Default role for created tenants
                house_id: house_id
            }]);

        if (profileError) {
            // Rollback auth user if profile fails (manual compensation)
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            throw profileError;
        }

        // 3. Update Phone if provided (in auth metadata or separate table if schema supported it, 
        // currently schema doesn't seem to have phone in users table based on read, but let's check.
        // Schema read shows users table only has: id, email, role, house_id, created_at.
        // The Tenant type in frontend has phone_number, likely from a join or hypothetical.
        // Wait, the frontend select is `*, houses(door_number)`.
        // Let's re-read schema.sql lines 29-35.
        // It does NOT have phone_number.
        // So we can't save phone number in public.users yet unless we add it.
        // For now, we will save it in user_metadata.

        await supabaseAdmin.auth.admin.updateUserById(authUser.user.id, {
            user_metadata: { name, phone_number }
        });

        return { success: true, message: "Tenant created successfully" };
    } catch (error: any) {
        console.error("Create Tenant Error:", error);
        return { error: error.message };
    }
}
