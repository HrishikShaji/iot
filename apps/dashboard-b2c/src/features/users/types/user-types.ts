import fetchInvitations from "../lib/fetchInvitations"
import fetchRoles from "../lib/fetchRoles"
import fetchTrailerAccesses from "../lib/fetchTrailerAccesses"
import { fetchUsers } from "../lib/fetchUsers"

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type UsersWithRole = ThenArg<ReturnType<typeof fetchUsers>>
export type TrailerAccessesWithRole = ThenArg<ReturnType<typeof fetchTrailerAccesses>>
export type RolesWithPermissions = ThenArg<ReturnType<typeof fetchRoles>>
export type Invitations = ThenArg<ReturnType<typeof fetchInvitations>>

