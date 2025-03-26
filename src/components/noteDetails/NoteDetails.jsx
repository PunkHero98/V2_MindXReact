import {Divider , Input, Timeline } from 'antd';
import { useState , useEffect } from 'react';

const NoteDetails = () =>{
    const [timeLine , setTimeLine] = useState([]);
    
    return(
        <div className='h-[500px] grid grid-cols-5 gap-4'>
            <div className='h-full w-full flex justify-start items-center'>
                <Timeline items={timeLine} />
            </div>
            <div className='col-span-4 flex flex-col gap-4'>
                <h3>Details</h3>
                <div className="flex justify-between items-center">
                    <div>
                        <Input className='w-full' placeholder="Oh yeah" size="large"/>
                    </div>
                    <Divider variant="solid"  type="vertical" className="bg-[#1677ff]"></Divider>
                    <div>
                        <Input placeholder="Oh yeah" size="large"/>

                    </div>
                </div>
            </div>
        </div>
    )
};

export default NoteDetails;