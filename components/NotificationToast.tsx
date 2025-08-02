'use client'

import { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useNotifications, Notification } from '@/contexts/NotificationContext'
import { motion, AnimatePresence } from 'framer-motion'

const typeIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

const typeStyles = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
}

const iconStyles = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400'
}

interface ToastNotificationProps {
  notification: Notification
  onClose: (id: string) => void
}

function ToastNotification({ notification, onClose }: ToastNotificationProps) {
  const IconComponent = typeIcons[notification.type]

  return (
    <Transition
      show={true}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className={`
          max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border
          ${typeStyles[notification.type]}
          backdrop-blur-sm
        `}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <IconComponent 
                className={`h-6 w-6 ${iconStyles[notification.type]}`}
                aria-hidden="true" 
              />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.title}
              </p>
              {notification.message && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {notification.message}
                </p>
              )}
              {notification.action && (
                <div className="mt-3">
                  <button
                    onClick={notification.action.onClick}
                    className={`
                      text-sm font-medium rounded-md px-3 py-2 hover:opacity-80 transition-opacity
                      ${notification.type === 'success' ? 'bg-green-600 text-white' : ''}
                      ${notification.type === 'error' ? 'bg-red-600 text-white' : ''}
                      ${notification.type === 'warning' ? 'bg-yellow-600 text-white' : ''}
                      ${notification.type === 'info' ? 'bg-blue-600 text-white' : ''}
                    `}
                  >
                    {notification.action.label}
                  </button>
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => onClose(notification.id)}
              >
                <span className="sr-only">Закрыть</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Transition>
  )
}

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotifications()
  
  // Показываем только последние 3 уведомления как toast
  const toastNotifications = notifications
    .filter(n => !n.read)
    .slice(0, 3)

  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {toastNotifications.map((notification) => (
            <ToastNotification
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}