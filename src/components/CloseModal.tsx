"use client";

import {FC} from 'react';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CloseModal= () => {
    // This component is used to close the modal
    const router = useRouter();
    return <Button aria-label='Close modal' variant='subtle' className='h-6 w-6 p-0 rounded-md'
    onClick={() => router.back()}>
        <X className='w-4 h-4' />
    </Button>
}

export default CloseModal;