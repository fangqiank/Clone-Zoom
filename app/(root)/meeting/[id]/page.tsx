'use client'

import { Loader } from "@/components/share/Loader";
import { MeetingRoom } from "@/components/share/MeetingRoom";
import { MeetingSetup } from "@/components/share/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { useState } from "react";

type MeetingPageProps = {
	params:{
		id: string
	}
};

const MeetingPage = ({params: {id}}: MeetingPageProps) => {
	const {user, isLoaded} = useUser()
	const [isSetupCompleted, setIsSetupCompleted] = useState(false)

	const {call, isCallLoading} = useGetCallById(id)

	if(!isLoaded || isCallLoading)
		return <Loader />

	return (
		<main className="h-screen w-full">
			<StreamCall call={call}>
				<StreamTheme>
					{!isSetupCompleted ? (
						<MeetingSetup setIsSetupComplete={setIsSetupCompleted}/>
					): (
						<MeetingRoom />
					)}
				</StreamTheme>
			</StreamCall>
		</main>
	)
};

export default MeetingPage;
