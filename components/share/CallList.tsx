//@ts-nocheck

'use client'

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MeetingCard } from "./MeetingCard";
import { Loader } from "./Loader";

type CallListProps = {
	type: 'ended' | 'upcoming' | 'recordings'
};

export const CallList = ({type}: CallListProps) => {
	const {endedCalls, upcomingCalls, callRecordings, isLoading} = useGetCalls()

	const [recordings, setRecordings] = useState<CallRecording[]>([])
	
	const router = useRouter()

	const getCalls = () => {
		switch (type) {
			case 'ended':
				return endedCalls

			case 'recordings':
				return recordings

			case 'upcoming':
				return upcomingCalls
			
			default:
				return []
		}
	}

	const getNoCallsMessage = () => {
		switch (type) {
			case 'ended':
				return 'No previous calls'

			case 'recordings':
				return 'No recordings'

			case 'upcoming':
				return 'No upcoming calls'
			
			default:
				return ''
		}
	}

	useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings])
	
	const calls = getCalls()
	const noCallsMessage = getNoCallsMessage()

	if(isLoading)
		return <Loader />

	return (
		<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
			{calls && calls.length > 0 
				? callRecordings.map((meeting: Call | CallRecording) => (
							<MeetingCard
								key={(meeting as Call)?.id} 
								icon={type === 'ended' 
									? '/icons/previous.svg' 
									: type === 'upcoming' 
										? '/icons/upcoming.svg'
										: '/icons/recordings.svg'
								}
								title={(meeting as Call).state?.custom?.description?.substring(0, 26) || meeting.filename?.substring(0, 20) || 'Personal Meeting'}
								date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
								isPreviousMeeting={type === 'ended'}
								buttonIcon={type === 'recordings' ? '/icons/play.svg' : undefined}
								buttonText={type === 'recordings' ? 'Play' : 'Start'}
								handleClick={type === 'recordings' 
									? () => router.push(`${meeting.url}`) 
									: () => router.push(`/meeting/${meeting.id}`)
								}
								link={type === 'recordings' 
									? meeting.url 
									: `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
								}
							/>
						)
					) 
				: (<h1>{noCallsMessage}</h1>)
			}
		</div>
	)
};


