import z from "zod";

export const WorkSpaceSchema = z.object({
    name:z.string().min(1, { message: 'WorkSpace name cannot be empty'})
})