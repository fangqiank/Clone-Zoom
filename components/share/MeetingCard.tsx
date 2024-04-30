'use client'

import Image from "next/image";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { avatarImages } from "@/constants";
import { Button } from "../ui/button";

type MeetingCardProps = {
	title: string,
  date: string,
  icon: string,
  isPreviousMeeting?: boolean,
  buttonIcon?: string,
  buttonText?: string,
  handleClick: () => void,
  link: string
}
export const MeetingCard = ({
	title,
	date,
	icon,
	isPreviousMeeting,
	buttonIcon,
	buttonText,
	handleClick,
	link
}:MeetingCardProps) => {
	const {toast} = useToast()

	return (
		<section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
			<article className="flex flex-col gap-5">
				<Image
					src={icon}
					alt="upcoming"
					width={28}
					height={28} 
				/>
				<div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
			</article>

			<article className='flex justify-center relative'>
				<div className="flex relative w-full max-sm:hidden">
					{avatarImages.map((img, idx) => {
						return (
							<Image
								key={idx}
								src={img}
								alt="attendees"
								width={40}
								height={40}
								className={cn('rounded-full', {absolute: idx > 0})}
								style={{top: 0, left: idx * 28}}
							/>
						)
					})}

					<div className="flex-center absolute left-[136px] size-10 round-full border-[5px] border-dark-3 bg-dark-4">
						+5
					</div>
				</div>

				{!isPreviousMeeting && (
					<div className="flex gap-2">
						<Button 
							className="rounded bg-blue-1 px-6"
							onClick={handleClick}
						>
							{buttonIcon && (
									<Image 
										src={buttonIcon} 
										alt="feature" 
										width={20} 
										height={20} 
									/>
								)
							}
							&nbsp;
							{buttonText}
						</Button>

						<Button
							className="bg-dark-4 px-6"
							onClick={() => {
								navigator.clipboard.writeText(link)
								toast({
									title: 'link copied'
								})
							}}
						>
							<Image
								src='/icons/copy.svg' 
								alt="clipboard"
								width={20}
								height={20}
							/>
							&nbsp;
							Copy Link 
						</Button>
					</div>
				)}
			</article>
		</section>
	)
};
