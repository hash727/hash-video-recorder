import { CreateWorkspace } from "@/actions/workspace"
import { useMutationData } from "./useMutationData"
import useZodForm from "./useZodForm"
import { WorkSpaceSchema } from "@/components/forms/schema"

export const useCreateWorkSpace = () => {
    const {mutate, isPending} = useMutationData(
        ['create-WorkSpace'], 
        (data: { name: string }) => CreateWorkspace(data.name), 'user-WorkSpaces'
    )

    const { errors, onFormSubmit, register } = useZodForm(WorkSpaceSchema as any, mutate);

    return { errors, onFormSubmit, register, isPending };
}