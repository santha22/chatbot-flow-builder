import React from 'react'
import { Handle, Position } from 'reactflow';

const VideoNode = ({ data, selected }) => {
  return (
    <div className={`w-40 shadow-md rounded-md bg-white ${selected ? "border-solid border-2 border-indigo-500/100" : ""}`}>
        <div className='flex flex-col'>
            <div className='max-h-max px-2 py-1 text-left text-black text-xs font-bold rounded-t-md bg-green-300'>
                🎥 Video Node
            </div>
            <div className='px-3 py-2'>
                {data.videoUrl && <video src={data.videoUrl} controls />}
            </div>
        </div>

        <Handle id='a' type='target' position={Position.Left} className='w-1 rounded-full bg-slate-500' />
        <Handle id='b' type='source' position={Position.Right} className='w-1 rounded-full bg-gray-500' />
      
    </div>
  )
}

export default VideoNode
