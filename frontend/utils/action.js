'use server'

import { revalidatePath } from "next/cache"

export const refetch =async (tokenName) => {
    // revalidatePath('/', 'page')

    revalidatePath('/', 'page')
    revalidatePath(`/token/[tokenName]`, 'page')
}