import { UseMutateFunction, UseMutationResult } from '@tanstack/react-query'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';

const useZodForm = <T extends z.ZodType<any>>(
    schema: T, 
    mutation: UseMutateFunction,
    defaultValues?: any
) => {
    const {
        register,
        watch,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { ...defaultValues },
    })

    const onFormSubmit = handleSubmit(async (values) => mutation({ ...values}))

    return {
        register, watch, reset, onFormSubmit, errors
    }
}

export default useZodForm