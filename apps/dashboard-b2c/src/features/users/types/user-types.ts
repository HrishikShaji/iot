import { fetchUsers } from "../lib/fetchUsers"

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type UsersWithRole = ThenArg<ReturnType<typeof fetchUsers>>

