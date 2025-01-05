'use client'

export const dynamic = 'force-dynamic';

import React, { useState, useCallback, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from 'lucide-react'
import getColorByScore from '../../../utils/colors'
import { Montserrat } from 'next/font/google'
import Image from 'next/image'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
});

// Types
interface CategoryScores {
  engagement: number;
  objection_handling: number;
  information_gathering: number;
  program_explanation: number;
  closing_skills: number;
  overall_effectiveness: number;
  overall_performance?: number;
  average_success: number;
}

interface CategoryFeedback {
  engagement: string;
  objection_handling: string;
  information_gathering: string;
  program_explanation: string;
  closing_skills: string;
  overall_effectiveness: string;
}

interface CallLog {
  id: number;
  call_number: number;
  user_name: string;
  user_picture_url: string;
  agent_name: string;
  agent_picture_url: string;
  call_date: string;
  call_recording_url: string;
  call_details: string;
  call_duration: number;
  power_moment: string;
  call_notes: string;
  level_up_1: string;
  level_up_2: string;
  level_up_3: string;
  call_transcript: string;
  scores: CategoryScores;
  feedback: CategoryFeedback;
}

type CategoryKey = 'engagement' | 'objection_handling' | 'information_gathering' | 'program_explanation' | 'closing_skills' | 'overall_effectiveness';

const scoreCategories = [
  { key: 'engagement', label: 'Engagement' },
  { key: 'objection_handling', label: 'Objection Handling' },
  { key: 'information_gathering', label: 'Information Gathering' },
  { key: 'program_explanation', label: 'Program Explanation' },
  { key: 'closing_skills', label: 'Closing Skills' },
  { key: 'overall_effectiveness', label: 'Effectiveness' },
] as const;

// AudioPlayer Component
const AudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSliderChange = (newValue: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const [newTime] = newValue
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full space-y-1.5">
      <audio ref={audioRef} src={src} />
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlayPause}
          className="h-8 w-8 rounded-full p-0 hover:bg-slate-100 text-slate-900"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSliderChange}
          className="flex-grow"
          aria-label="Audio progress"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

// Main Page Component
export default function CallRecordPage() {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})
  const [callNotes, setCallNotes] = useState<Record<number, string>>({})
  const [savedStates, setSavedStates] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [call, setCall] = useState<CallLog | null>(null)

  useEffect(() => {
    const fetchCall = async () => {
      try {
        // Simulace načtení dat - v reálném použití byste zde měli API call
        const mockCall: CallLog = {
          id: 5,
          call_number: 5,
          user_name: "David",
          user_picture_url: "",
          agent_name: "Lukas Sys",
          agent_picture_url: "",
          call_date: "2024-12-16T00:02:00",
          call_recording_url: "/sample-recording.mp3",
          call_details: "Overall excellent performance scoring 93/100, demonstrating consistent high-level communication skills across all categories...",
          call_duration: 6,
          power_moment: "Lukas excellently handled a challenging moment when explaining the program's value proposition...",
          call_notes: "",
          level_up_1: "Further develop storytelling techniques to enhance program explanation",
          level_up_2: "Practice more varied objection handling approaches for complex situations",
          level_up_3: "Work on reducing call duration while maintaining high information quality",
          call_transcript: "",
          scores: {
            engagement: 93,
            objection_handling: 92,
            information_gathering: 94,
            program_explanation: 94,
            closing_skills: 95,
            overall_effectiveness: 91,
            average_success: 93
          },
          feedback: {
            engagement: "",
            objection_handling: "",
            information_gathering: "",
            program_explanation: "",
            closing_skills: "",
            overall_effectiveness: ""
          }
        };
        
        setCall(mockCall)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load call')
        setIsLoading(false)
      }
    }

    fetchCall()
  }, [])

  const toggleExpandCard = useCallback((id: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const handleNotesChange = (id: number, text: string) => {
    setCallNotes(prev => ({
      ...prev,
      [id]: text
    }))
  }

  const saveNotes = async (id: number) => {
    try {
      // Zde by byl skutečný API call pro uložení poznámek
      setSavedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, [id]: false }));
      }, 3000);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-transparent">
        <div className="relative w-24 h-24">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-slate-900"></div>
        </div>
      </div>
    )
  }

  if (error || !call) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-transparent">
        <div className="text-red-500">
          {error || 'Call not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f2f3f8' }}>
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg rounded-[32px] overflow-hidden border-0">
          <CardContent className="p-6 bg-white">
            {/* Header Section */}
            <div className="flex items-center justify-start mb-6 gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={call.agent_picture_url || "/placeholder.svg?height=48&width=48"}
                  alt={`${call.agent_name}'s profile`}
                  className="rounded-full w-12 h-12 bg-slate-100"
                />
                <div>
                  <p className="text-sm font-medium text-slate-700">{call.agent_name}</p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Call #{call.call_number}
                  </h2>
                </div>
              </div>

              <div className="flex-1 text-center">
                <p className="text-slate-700 text-sm mb-1">Overall Score - League Points</p>
                <p className="text-[#4B76E5] text-3xl font-bold">
                  {Math.round(call.scores.average_success)}/100
                </p>
              </div>

              <div className="ml-auto text-right">
                <p className="text-sm text-slate-600">
                  {new Date(call.call_date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm font-medium text-slate-700 mt-1">
                  Call duration: {call.call_duration} seconds
                </p>
              </div>
            </div>

            {/* Score Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {scoreCategories.map((category) => {
                const score = call.scores[category.key];
                const color = getColorByScore(score);
                return (
                  <div key={category.key} className="relative overflow-hidden rounded-xl" style={{ backgroundColor: `${color}20` }}>
  <div className="px-4 py-3 text-sm font-medium flex flex-col justify-between h-full items-center text-center">
    <span className="text-slate-600">{category.label}</span>
    <div className="text-2xl font-bold" style={{ color: getColorByScore(score) }}>
      {score}/100
    </div>
  </div>
  <div 
    className="absolute bottom-0 left-0 h-1 transition-all duration-300"
    style={{ 
      width: `${score}%`,
      backgroundColor: color
    }}
  />
</div>
                );
              })}
            </div>

            {/* Toggle Button */}
            <Button
              variant="ghost"
              className="text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 w-full mt-4 rounded-xl"
              onClick={() => toggleExpandCard(call.id)}
            >
              {expandedCards[call.id] ? (
                <>
                  Hide Details <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Call Details <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Expandable Content */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
              expandedCards[call.id] 
                ? 'max-h-[5000px] opacity-100 mt-6' 
                : 'max-h-0 opacity-0 mt-0'
            }`}
            >
              <div className="p-6 bg-white rounded-[32px] shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Call Details</h3>
                <div className="space-y-6 bg-white">
                  {/* Power Moment and Notes Section */}
                  <div className="grid grid-cols-2 gap-4 bg-white">
                    <Card className="relative overflow-hidden border-0 bg-white rounded-[32px] shadow-lg">
                      <CardContent className="p-6 bg-white">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">⚡ Power Moment!</h3>
                        <p className="text-white p-4 rounded-xl w-full" style={{ backgroundColor: 'rgba(91, 6, 190, 0.5)' }}>
                          {call.power_moment || "No power moment recorded"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-white rounded-[32px] shadow-lg">
  <CardContent className="p-6 bg-white">
    <div className="mb-2">
      <h3 className="text-lg font-semibold text-slate-900">
        Call Notes
      </h3>
    </div>
    <Textarea
      placeholder="Enter your notes here..."
      value={callNotes[call.id] ?? call.call_notes}
      onChange={(e) => handleNotesChange(call.id, e.target.value)}
      className="min-h-[100px] mb-2 rounded-[20px]"
    />
    <Button 
      onClick={() => saveNotes(call.id)}
      className="w-full rounded-[20px]"
    >
      {savedStates[call.id] ? "Saved!" : "Save"}
    </Button>
  </CardContent>
</Card>
                  </div>

                  {/* Analysis and Level Up Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Analysis Card */}
                    <Card className="relative overflow-hidden border-0 bg-white rounded-[32px] shadow-lg">
                      <CardContent className="p-6 bg-white">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-slate-900 text-xl font-semibold">Detailed Analysis</span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-600">Overall Score</span>
                            <span className="text-2xl font-bold" style={{ color: getColorByScore(call.scores.average_success) }}>
                              {call.scores.average_success}/100
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${call.scores.average_success}%`,
                                backgroundColor: getColorByScore(call.scores.average_success)
                              }}
                            />
                          </div>
                          <p className="text-slate-600">
                            {call.call_details || "No detailed analysis available"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Level Up Plan Card */}
                    <Card className="relative overflow-hidden border-0 bg-white rounded-[32px] shadow-lg">
                      <CardContent className="p-6 bg-white">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-slate-900 text-xl font-semibold">Level Up Plan</span>
                        </div>
                        <div className="space-y-4">
                          {(!call.level_up_1 && !call.level_up_2 && !call.level_up_3) ? (
                            <div className="bg-[#fef8e8] text-slate-800 p-4 rounded-xl flex items-center gap-2">
                              No Plan
                            </div>
                          ) : (
                            <>
                              {call.level_up_1 && (
                                <div className="bg-[#fef8e8] text-slate-800 p-4 rounded-xl flex items-center gap-2">
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 15L9 9L13 13L20 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  {call.level_up_1}
                                </div>
                              )}
                              {call.level_up_2 && (
                                <div className="bg-[#fef8e8] text-slate-800 p-4 rounded-xl flex items-center gap-2">
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 15L9 9L13 13L20 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  {call.level_up_2}
                                </div>
                              )}
                              {call.level_up_3 && (
                                <div className="bg-[#fef8e8] text-slate-800 p-4 rounded-xl flex items-center gap-2">
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 15L9 9L13 13L20 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  {call.level_up_3}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Call Recording Section */}
                  <Card className="relative overflow-hidden border-0 bg-white rounded-[32px] shadow-lg w-full">
                    <CardContent className="p-6 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-900 text-xl font-semibold">Call Recording</span>
                      </div>
                      <AudioPlayer src={call.call_recording_url} />
                    </CardContent>
                  </Card>

                  {/* Call Transcript Section */}
                  <Card className="relative overflow-hidden border-0 bg-white rounded-[32px] shadow-lg w-full">
                    <CardContent className="p-6 bg-white">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-900 text-xl font-semibold">Call Transcript</span>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                        {call.call_transcript.split('role:').map((segment, index) => {
                          if (!segment.trim()) return null;
                          
                          const [roleType, ...messageParts] = segment.split('message:');
                          if (!messageParts.length) return null;

                          const isBot = roleType.trim() === 'bot';
                          const message = messageParts.join('message:').trim();
                          
                          return (
                            <div 
                              key={index}
                              className="p-3 rounded-lg"
                              style={{ 
                                backgroundColor: isBot 
                                  ? 'rgba(248, 185, 34, 0.1)'
                                  : 'rgba(91, 6, 190, 0.1)'
                              }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6">
                                  <img
                                    src={isBot ? call.agent_picture_url : call.user_picture_url || '/placeholder.svg?height=24&width=24'}
                                    alt={`${isBot ? call.agent_name : call.user_name}'s avatar`}
                                    className="w-full h-full rounded-[20px]"
                                  />
                                </div>
                                <span className="text-sm" style={{ color: '#000' }}>
                                  {isBot ? call.agent_name : call.user_name}
                                </span>
                              </div>
                              <p className="text-sm" style={{ color: '#000' }}>
                                {message}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bottom Toggle Button */}
                  <Button
                    variant="ghost"
                    className="text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 w-full mt-6 rounded-xl"
                    onClick={() => toggleExpandCard(call.id)}
                  >
                    Hide Details <ChevronUp className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
