import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements, 
} as const;

export const ac = createAccessControl(statement);

export const userRole = ac.newRole({
    user:[]
});

export const adminRole = ac.newRole({
    user:["list","create","update"]
});

export const superAdminRole = ac.newRole({
   ...adminAc.statements
});

export const roles={
    user:userRole,
    admin:adminRole,
    superAdmin:superAdminRole,
} as const
export type roleName =keyof typeof roles