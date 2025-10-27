// hooks/useOrganizationId.ts
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";

export const useOrganizationId = (): string => {
    const { userData } = useSelector(selectAuthState);
    const organizationId = userData?.organizationPublicId;
    if (!organizationId) {
        throw new Error("Organization ID not available — user not authenticated?");
    }
    return organizationId || "";
};
