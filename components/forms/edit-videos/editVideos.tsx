import FormGenerator from '@/components/global/form-generator/formGenerator'
import { Button } from '@/components/ui/button'
import { useEditVideo } from '@/hooks/useEditVideo'
import React from 'react'

type Props = {
    videoId: string
    title: string
    description: string
}

const EditVideoForm = ({description, title, videoId}: Props) => {
    const { errors, isPending, onFormSubmit, register} = useEditVideo(
        videoId,
        title,
        description
    )
  return (
    <form 
        onSubmit={onFormSubmit} 
        className='flex flex-col gap-y-5'
    >
        <FormGenerator
            register={register}
            errors={errors}
            name='title'
            inputType='input'
            type='text'
            placeholder={'Video Title...'}
            label='Title'
        />

        <FormGenerator
            register={register}
            errors={errors}
            name='description'
            inputType='textarea'
            type='text'
            lines={7}
            placeholder={'Video Description...'}
            label='Description'
        />
        <Button
            variant={'outline'}
        >Submit</Button>
    </form>
  )
}

export default EditVideoForm