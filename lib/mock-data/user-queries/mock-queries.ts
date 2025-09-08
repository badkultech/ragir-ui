import { es } from "date-fns/locale"

// Mock data
const queries = [
  {
    id: 1,
    tripName: "Himalayan Winter Trek",
    userName: "Rahul Sharma",
    userPhone: "+91 9876543210",
    userEmail: "rahul@example.com",
    query: "What is the difficulty level of this trek? I'm a beginner and want to know if it's suitable for me.",
    status: "pending",
    priority: "medium",
    createdAt: "2024-12-08T10:30:00Z",
    responseTime: null,
    communicationPreference: "whatsapp",
  },
  {
    id: 2,
    tripName: "Goa Beach Adventure",
    userName: "Priya Patel",
    userPhone: "+91 9876543211",
    userEmail: "priya@example.com",
    query: "Are meals included in the package? I have dietary restrictions and need vegetarian options.",
    status: "responded",
    priority: "low",
    createdAt: "2024-12-07T14:15:00Z",
    responseTime: "2024-12-07T16:30:00Z",
    communicationPreference: "call",
  },
  {
    id: 3,
    tripName: "Kerala Backwaters",
    userName: "Amit Kumar",
    userPhone: "+91 9876543212",
    userEmail: "amit@example.com",
    query: "Can I join this trip solo? What is the group composition usually like?",
    status: "pending",
    priority: "high",
    createdAt: "2024-12-06T09:45:00Z",
    responseTime: null,
    communicationPreference: "whatsapp",
  },
  {
    id: 4,
    tripName: "Rajasthan Desert Safari",
    userName: "Sneha Gupta",
    userPhone: "+91 9876543213",
    userEmail: "sneha@example.com",
    query: "What should I pack for the desert trip? Any specific clothing recommendations?",
    status: "responded",
    priority: "medium",
    createdAt: "2024-12-05T11:20:00Z",
    responseTime: "2024-12-05T13:45:00Z",
    communicationPreference: "message",
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  responded: "bg-green-100 text-green-800",
  urgent: "bg-red-100 text-red-800",
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}
export { queries, statusColors, priorityColors }