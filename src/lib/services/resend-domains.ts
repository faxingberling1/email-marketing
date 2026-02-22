import { resend } from "@/lib/resend";

export interface DomainRecord {
    type: string;
    name: string;
    value: string;
    status: string;
}

export async function registerDomain(domain: string) {
    try {
        const { data, error } = await resend.domains.create({ name: domain });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Resend Domain Registration Error:", error);
        throw error;
    }
}

export async function verifyDomain(resendId: string) {
    try {
        const { data, error } = await resend.domains.verify(resendId);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Resend Domain Verification Error:", error);
        throw error;
    }
}

export async function getDomainDetails(resendId: string) {
    try {
        const { data, error } = await resend.domains.get(resendId);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Resend Domain Fetch Error:", error);
        throw error;
    }
}

export async function deleteDomain(resendId: string) {
    try {
        const { data, error } = await resend.domains.remove(resendId);
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Resend Domain Deletion Error:", error);
        throw error;
    }
}
