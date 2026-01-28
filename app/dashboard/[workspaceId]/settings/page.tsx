'use client'
import { enableFirstView, getFirstView } from '@/actions/user'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {}

const SettingsPage = (props: Props) => {
    const [firstView, setFirstView] = useState<undefined | boolean>()
    const { setTheme, theme } = useTheme()

    useEffect(() => {
        if(firstView !== undefined) return
        const fetchData = async () => {
            const response = await getFirstView()
            if(response.status === 200) setFirstView(response?.data!)
        }
        fetchData()
    }, [firstView])

    const SwitchState = async (checked: boolean) => {
        const view = await enableFirstView(checked)
        console.log(view)
        if(view){
            toast(view.status === 200 ? 'Success' : 'Failed', {
                description: view.data,
            })
        }
    }
  return (
    <div>
        <h2 className='text-2xl font-bold mt-4'>Video Sharing Settings</h2>
        <p className='text-muted-foreground'>
            Enabling this feature will send you notifications when someone watched your video for the first time. This feature can help during client outreach.
        </p>
        <Label className='flex items-center gap-x-3 mt-4 text-md'>
            Enable First View
            <Switch
                onCheckedChange={SwitchState}
                disabled={firstView === undefined}
                checked={firstView}
                onClick={() => setFirstView(!firstView)}
            />
        </Label>
    </div>
  )
}

export default SettingsPage