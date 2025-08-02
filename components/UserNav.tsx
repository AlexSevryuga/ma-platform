'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function UserNav() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-4">  
        <Link
          href="/auth/signin"
          className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Войти
        </Link>
        <Link
          href="/auth/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Регистрация
        </Link>
      </div>
    )
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="relative flex rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Открыть меню пользователя</span>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            {session.user?.image ? (
              <img
                className="h-8 w-8 rounded-full"
                src={session.user.image}
                alt={session.user.name || ''}
              />
            ) : (
              <UserCircleIcon className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Item>
          {({ active }) => (
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {session.user?.email}
                </p>
                {session.user?.role && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {session.user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                  </p>
                )}
              </div>
              
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/dashboard"
                    className={classNames(
                      active ? 'bg-gray-100 dark:bg-gray-700' : '',
                      'flex px-4 py-2 text-sm text-gray-700 dark:text-gray-200 items-center'
                    )}
                  >
                    <Cog6ToothIcon className="mr-3 h-4 w-4" />
                    Дашборд
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleSignOut}
                    className={classNames(
                      active ? 'bg-gray-100 dark:bg-gray-700' : '',
                      'flex w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 items-center'
                    )}
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                    Выйти
                  </button>
                )}
              </Menu.Item>
            </div>
          )}
        </Menu.Item>
      </Transition>
    </Menu>
  )
}