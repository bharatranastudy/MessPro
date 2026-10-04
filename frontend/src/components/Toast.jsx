import React, { useEffect } from 'react'
import { IoCheckmarkCircle, IoAlertCircle, IoInformationCircle } from 'react-icons/io5'
import { RxCross2 } from 'react-icons/rx'

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
        if (!message) return
        const timer = setTimeout(() => {
            if (onClose) onClose()
        }, duration)
        return () => clearTimeout(timer)
    }, [message, duration, onClose])

    if (!message) return null

    const bgColors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    }

    const icons = {
        success: <IoCheckmarkCircle size={22} />,
        error: <IoAlertCircle size={22} />,
        info: <IoInformationCircle size={22} />
    }

    return (
        <div className={`fixed bottom-5 right-5 z-[99999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 ${bgColors[type] || bgColors.info}`}>
            <div className='flex items-center gap-2 font-medium text-sm'>
                {icons[type] || icons.info}
                <span>{message}</span>
            </div>
            <button onClick={onClose} className='ml-2 opacity-80 hover:opacity-100 cursor-pointer'>
                <RxCross2 size={18} />
            </button>
        </div>
    )
}

export default Toast
