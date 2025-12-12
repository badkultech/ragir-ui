"use client"

import { useState } from "react"
import {
    ChevronDown,
    ChevronUp,
    MessageCircleQuestion,
    CheckCircle,
    Clock,
    MessageSquare,
    Flag,
    X,
    ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GradientCheckbox from "@/components/ui/GradientCheckbox"
import { MainHeader } from "@/components/search-results/MainHeader"

type QuestionStatus = "responded" | "pending"

interface Question {
    id: string
    question: string
    status: QuestionStatus
    askedDate: string
    response?: {
        author: string
        respondedDate: string
        text: string
    }
    warningMessage?: string
}

const mockQuestions: Question[] = [
    {
        id: "1",
        question: "Is camping equipment provided?",
        status: "responded",
        askedDate: "25-08-2025",
        response: {
            author: "Ragir Team",
            respondedDate: "25-08-2025",
            text: "Yes, all camping equipment including tents, sleeping bags, and mats are provided.",
        },
    },
    {
        id: "2",
        question: "What is the difficulty level?",
        status: "responded",
        askedDate: "25-08-2025",
        response: {
            author: "Ragir Team",
            respondedDate: "25-08-2025",
            text: "The trek is considered moderate difficulty, suitable for beginners with basic fitness.",
        },
    },
    {
        id: "3",
        question: "Are meals included in the package?",
        status: "pending",
        askedDate: "24-08-2025",
        warningMessage: "Our team will get back to you soon!",
    },
]

export default function MyQueriesPage() {
    const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])
    const [showAskModal, setShowAskModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [reportingQuestionId, setReportingQuestionId] = useState<string | null>(null)
    const [newQuestion, setNewQuestion] = useState("")
    const [reportReasons, setReportReasons] = useState<string[]>([])
    const [reportDetails, setReportDetails] = useState("")
    const router = useRouter()

    const totalQueries = mockQuestions.length
    const respondedQueries = mockQuestions.filter((q) => q.status === "responded").length
    const pendingQueries = mockQuestions.filter((q) => q.status === "pending").length

    const toggleQuestion = (id: string) => {
        setExpandedQuestions((prev) => (prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]))
    }

    const handleAskQuestion = () => {
        // Handle submission
        console.log("New question:", newQuestion)
        setNewQuestion("")
        setShowAskModal(false)
    }

    const handleReport = (questionId: string) => {
        setReportingQuestionId(questionId)
        setShowReportModal(true)
    }

    const handleSubmitReport = () => {
        console.log("Report submitted:", {
            questionId: reportingQuestionId,
            reasons: reportReasons,
            details: reportDetails,
        })
        setShowReportModal(false)
        setReportReasons([])
        setReportDetails("")
        setReportingQuestionId(null)
    }

    const reportOptions = [
        "Spam or irrelevant content",
        "Inappropriate or offensive language",
        "Misleading or false information",
        "Invalid contact information",
        "Other (please specify below)",
    ]

    const toggleReportReason = (reason: string) => {
        setReportReasons((prev) => (prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]))
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
           <MainHeader logoText="My Queries" isLoggedIn={true}/>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold">My Queries</h2>
                    <Button onClick={() => setShowAskModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                        <MessageCircleQuestion className="h-4 w-4 mr-2" />
                        Ask a Question
                    </Button>
                </div>

                {/* Trip Info Banner */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex gap-3">
                    <div className="text-orange-600 mt-0.5">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Trip Dates: 15-09-2025 to 22-09-2025</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Have questions about your upcoming trip? Ask away! Our team typically responds within 24 hours.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#E4E4E4] rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="text-gray-600">
                                <MessageSquare className="h-5 w-5 text-[#000000]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Queries</p>
                                <p className="text-2xl font-bold">{totalQueries.toString().padStart(2, "0")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#E4E4E4]  rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="text-gray-600">
                                <CheckCircle className="h-5 w-5 text-black" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Responded</p>
                                <p className="text-2xl font-bold">{respondedQueries.toString().padStart(2, "0")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#E4E4E4]  rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="text-gray-600">
                                <Clock className="h-5 w-5 text-black" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold">{pendingQueries.toString().padStart(2, "0")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-4">Your Questions</h3>
                </div>

                <div className="space-y-4">
                    {mockQuestions.map((question) => (
                        <div key={question.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Question Header */}
                            <button
                                onClick={() => toggleQuestion(question.id)}
                                className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded ${question.status === "responded"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {question.status === "responded" ? "Responded" : "Pending"}
                                        </span>
                                        <span className="text-xs text-gray-500">Asked on {question.askedDate}</span>
                                    </div>
                                    <h4 className="font-medium text-gray-900">{question.question}</h4>
                                </div>
                                {expandedQuestions.includes(question.id) ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                                )}
                            </button>

                            {/* Question Details */}
                            {expandedQuestions.includes(question.id) && (
                                <div className=" p-4 bg-white">
                                    {question.response ? (
                                        <div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                    R
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div>
                                                            <span className="font-medium text-gray-900">{question.response.author}</span>
                                                            <span className="text-sm text-gray-500 ml-2">
                                                                Responded on {question.response.respondedDate}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleReport(question.id)}
                                                            className="text-red-600 bg-[#FFEEEE] hover:text-[#FE336A] hover:cursor-pointer hover:bg-red-50"
                                                        >
                                                            <Flag className="h-4 w-4 mr-1" />
                                                            Report
                                                        </Button>
                                                    </div>
                                                    <p className="text-gray-700 bg-[#E4E4E4] rounded-lg p-3 border border-gray-200">
                                                        {question.response.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                                            <div>
                                                <span className="font-medium text-yellow-900">Awaiting response</span>
                                                <span className="text-yellow-700"> - {question.warningMessage}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* Ask a New Question Modal */}
            {showAskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Ask a New Question</h3>
                            <button onClick={() => setShowAskModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <Textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter your question here (eg. What should I pack? Are there any age restrictions?"
                            className="min-h-[120px] mb-4"
                        />
                        <div className="flex gap-3 flex-col sm:flex-row  justify-start">
                            <Button onClick={handleAskQuestion} className="bg-orange-500 hover:bg-orange-600 text-white">
                                Submit Question
                            </Button>
                            <Button
                                onClick={() => setShowAskModal(false)}
                                className="
                                    flex
                                    bg-white
                                    text-[#6B6B6B]
                                    border border-[#E4E4E4]
                                    hover:bg-muted
                                    font-medium
                                    rounded-lg
                                    transition
                                "
                            >
                                Cancel
                            </Button>

                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Confirm Report</h3>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Select all reasons that apply for reporting this query. This will help our team take appropriate action.
                        </p>

                        <div className="space-y-3 mb-6">
                            {reportOptions.map((option) => (
                                <div
                                    key={option}
                                    className={`
                                                flex items-start gap-3 p-3 rounded-lg transition
                                                hover:bg-gray-50 hover:border-[#FF804C]
                                                ${reportReasons.includes(option)
                                            ? " border border-[#FF804C]"   // selected state
                                            : " border border-gray-200"
                                        }
                                                `}
                                >
                                    <GradientCheckbox
                                        id={option}
                                        checked={reportReasons.includes(option)}
                                        onChange={() => toggleReportReason(option)}
                                    />

                                    <label
                                        htmlFor={option}
                                        className="text-sm text-gray-700 cursor-pointer flex-1"
                                    >
                                        {option}
                                    </label>
                                </div>

                            ))}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional details (optional):</label>
                            <Textarea
                                value={reportDetails}
                                onChange={(e) => setReportDetails(e.target.value)}
                                placeholder="Please provide more details about why you're reporting this query."
                                className="min-h-[100px]"
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">{reportDetails.length}/500 Words</div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setShowReportModal(false)}
                                className=" flex-1  border border-[#E4E4E4]  text-[#6B6B6B]  bg-white hover:bg-[#F7F7F7] rounded-lg font-medium transition"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitReport}
                                className="flex-1 bg-orange-500  hover:bg-orange-600  text-white rounded-lg font-medium transition "
                            >
                                Yes, Report
                            </Button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
