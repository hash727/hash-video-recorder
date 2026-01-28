import { useCreateWorkSpace } from '@/hooks/useCreateWorkSpace'
import React from 'react'
import FormGenerator from '../global/form-generator/formGenerator'
import { Button } from '../ui/button'
import Loader from '../global/loader/loader'


const WorkSpaceForm = () => {
  const {errors, isPending, onFormSubmit, register} = useCreateWorkSpace()
  return (
    <form 
        onSubmit={onFormSubmit}
        className='flex flex-col gap-y-3'
    >
        <FormGenerator 
            name='name'
            placeholder={'WorkSpace Name'}
            label='Name'
            errors={errors}
            inputType='input'
            type='text'
            register={register}
        />

        <Button
            className='text-sm w-full mt-2'
            type='submit'
            disabled={isPending}
        >
            <Loader state={false}>Create WorkSpace</Loader>
        </Button>
    </form>
  )
}

export default WorkSpaceForm