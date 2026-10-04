import axios from 'axios'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'
const STAGES = [
  { label: 'Order Placed', key: 'pending' },
  { label: 'Preparing', key: 'preparing' },
  { label: 'Out for Delivery', key: 'out of delivery' },
  { label: 'Delivered', key: 'delivered' }
]

function getStageIndex(status) {
  if (status === 'delivered') return 3
  if (status === 'out of delivery') return 2
  if (status === 'preparing') return 1
  return 0
}

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState() 
    const navigate = useNavigate()
    const {socket}=useSelector(state=>state.user)
    const [liveLocations,setLiveLocations]=useState({})
    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(!socket) return
        socket.on('updateDeliveryLocation',({deliveryBoyId,latitude,longitude})=>{
            setLiveLocations(prev=>({
              ...prev,
              [deliveryBoyId]:{lat:latitude,lon:longitude}
            }))
        })
        return () => {
            socket.off('updateDeliveryLocation')
        }
    },[socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])
    return (
        <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
            <div className='relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
            </div>
      {currentOrder?.shopOrders?.map((shopOrder,index)=>(
        <div className='bg-white p-5 rounded-2xl shadow-md border border-orange-100 space-y-4' key={index}>
         <div>
            <p className='text-lg font-bold mb-1 text-[#ff4d2d]'>{shopOrder.shop?.name}</p>
            <p className='font-semibold text-sm text-gray-700'><span>Items:</span> {shopOrder.shopOrderItems?.map(i=>i.name || i.item?.name).join(", ")}</p>
            <p className='text-sm text-gray-600'><span className='font-semibold'>Subtotal:</span> ₹{shopOrder.subtotal}</p>
            <p className='mt-2 text-sm text-gray-600'><span className='font-semibold'>Delivery address:</span> {currentOrder.deliveryAddress?.text}</p>
         </div>

         {/* 4-Stage Order Status Stepper */}
         <div className='w-full my-4 py-3 px-2 bg-orange-50/50 rounded-xl border border-orange-100'>
           <div className='flex items-center justify-between relative'>
             {STAGES.map((stage, idx) => {
               const currentIdx = getStageIndex(shopOrder.status)
               const isCompleted = idx <= currentIdx
               const isCurrent = idx === currentIdx
               return (
                 <div key={idx} className='flex flex-col items-center flex-1 relative z-10'>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                     isCompleted ? 'bg-[#ff4d2d] text-white shadow-md' : 'bg-gray-200 text-gray-500'
                   } ${isCurrent ? 'ring-4 ring-orange-200 scale-110' : ''}`}>
                     {idx + 1}
                   </div>
                   <span className={`text-[11px] md:text-xs mt-1.5 font-medium text-center ${
                     isCompleted ? 'text-gray-900 font-semibold' : 'text-gray-400'
                   }`}>
                     {stage.label}
                   </span>
                 </div>
               )
             })}
           </div>
         </div>

         {shopOrder.status!="delivered"?<>
{shopOrder.assignedDeliveryBoy?
<div className='text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border'>
<p className='font-semibold'><span>Delivery Boy:</span> {shopOrder.assignedDeliveryBoy.fullName}</p>
<p className='font-semibold'><span>Contact:</span> {shopOrder.assignedDeliveryBoy.mobile}</p>
</div>:<p className='font-semibold text-orange-600 text-sm'>Delivery Boy is not assigned yet.</p>}
         </>:<p className='text-green-600 font-semibold text-lg'>✓ Delivered</p>}

{(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") && (
  <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md border">
    <DeliveryBoyTracking data={{
      deliveryBoyLocation:liveLocations[shopOrder.assignedDeliveryBoy._id] || {
        lat: shopOrder.assignedDeliveryBoy.location?.coordinates?.[1] || 0,
        lon: shopOrder.assignedDeliveryBoy.location?.coordinates?.[0] || 0
      },
      customerLocation: {
        lat: currentOrder.deliveryAddress?.latitude || 0,
        lon: currentOrder.deliveryAddress?.longitude || 0
      }
    }} />
  </div>
)}

        </div>
      ))}

        </div>
    )
}

export default TrackOrderPage
