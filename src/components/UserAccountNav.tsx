"use client";
import { User } from 'next-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/DropDownMenu'; 
import {FC} from 'react';
import UserAvatar from './UserAvatar';
import Link from 'next/link';
import { signOut } from 'next-auth/react';



interface UserAccountNavProps {
    user:Pick<User, 'email' | 'name' | 'image'>;
}

const UserAccountNav: FC<UserAccountNavProps> = ({user}) => {
  return <DropdownMenu> 
    <DropdownMenuTrigger>
      <UserAvatar className='h-8 w-8' user={{
        image: user.image || null,
        name: user.name || null,
      }} />
    </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white align-end'>
        <div className='flex items-center justify-start gap-2 p-2'> 
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name &&  <p className='font-medium'> {user.name}</p>}
            {user.email && <p className='w-[200px] truncate text-sm text-zinc-700'>{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild> 
          <Link href='/'> Feed </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild> 
          <Link href='/r/create'> Create Community </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild> 
          <Link href='/settings'> Settings </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className='cursor-pointer' onSelect={(event) => {
          event.preventDefault();
          signOut({ callbackUrl: `${window.location.origin}/sign-in`})
        }}>Sign Out
        </DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>
}


export default UserAccountNav;