
import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'
import Loader from '../loader/loader'
import { Bot, Download, FileIcon, FileTextIcon, LoaderIcon, Pencil, StarIcon, VideoIcon } from 'lucide-react'

type Props = {
    plan: 'PRO' | 'FREE'
    trial: boolean
    videoId: string
}

const AiTools = ({ plan, trial, videoId }: Props) => {

  return (
    // Are they on a free plan?
    // have they already tried the AI feature?
    // if not? Try button
    // wip: setup the ai hook
   
    <TabsContent
        value="Ai tools"
        className='p-5 bg-[#1D1D1D] rounded-xl flex flex-col gap-y-10'
    >
        {' '}
        <div className='flex items-center'>
            <div className='w-8/12'>
                <h2 className='text-3xl font-bold'>Ai Tools</h2>
                <p className='text-[#BDBDBD]'>
                    Taking your video to the next <br /> step with the power of AI!
                </p>
            </div>
            
            <div className='flex items-center justify-between gap-4'>
                <Button className=' mt-2 text-sm '>
                    <Loader
                        state={false}
                        color='#000'
                    >
                        Try now
                    </Loader>
                </Button>

                {/* wip: pay button */}
                <Button 
                    className='mt-2 text-sm'
                    variant={'secondary'}
                >
                    <Loader
                        state={false}
                        color='#000'
                    >
                        Pay now
                    </Loader>
                </Button>

                {/* <Button className=' mt-2 text-sm '>
                    <Loader
                        state={false}
                        color='#000'
                    >
                        Generate now
                    </Loader>
                </Button> */}
            </div>
            {/* <div className='flex justify-between'>
                <div className='flex flex-col items-center text-center text-[#BDBDBD] gap-y-2 text-sm'>
                    <VideoIcon 
                        width={'36'} 
                        height={'36'} 
                    />
                    Generate Video
                </div>
                <div className='flex flex-col items-center text-center text-[#BDBDBD] gap-y-2 text-sm'>
                    <FileIcon 
                        width={'36'} 
                        height={'36'} 
                    />
                    Create and Read Video <br /> Transcripts
                </div>
                <div className='flex flex-col items-center text-center text-[#BDBDBD] gap-y-2 text-sm'>
                    <Download 
                        width={'36'} 
                        height={'36'} 
                    />
                    Download Video <br /> File
                </div>

            </div> */}

        </div>
        <div className='border rounded-xl p-4 gap-4 flex flex-col bg-[#1b0f1b7f]'>
            <div className='flex items-center gap-2'>
                <h2 className='text-2xl font-bold text-[#a22fe0]'>HasH Ai</h2>
                <StarIcon
                    color='#a22f20'
                    fill='#a22fe0'
                />
            </div>
            <div className='flex gap-2 items-start'>
                <div className='p-2 rounded-full border-[#2d2d2d] border-2 bg-[#2b2b2b]'>
                    <Pencil color='#a22fe0' />
                </div>
                <div className='flex flex-col'>
                    <h3 className='text-md'>Summary</h3>
                    <p className='text-mutted-foreground text-sm'>
                        Generate a description for your video using AI.
                    </p>
                </div>
            </div>

            <div className='flex gap-2 items-start'>
                <div className='p-2 rounded-full border-[#2d2d2d] border-2 bg-[#2b2b2b]'>
                    <FileTextIcon color='#a22fe0' />
                </div>
                <div className='flex flex-col'>
                    <h3 className='text-md'>Summary</h3>
                    <p className='text-mutted-foreground text-sm'>
                        Generate a description for your video using AI.
                    </p>
                </div>
            </div>

            <div className='flex gap-2 items-start'>
                <div className='p-2 rounded-full border-[#2d2d2d] border-2 bg-[#2b2b2b]'>
                    <Bot color='#a22fe0' />
                </div>
                <div className='flex flex-col'>
                    <h3 className='text-md'>Ai Agent</h3>
                    <p className='text-mutted-foreground text-sm'>
                        Viewers can ask questions on your video and our Ai agent will respond.
                    </p>
                </div>
            </div>


        </div>
    </TabsContent>
    
  )
}

export default AiTools