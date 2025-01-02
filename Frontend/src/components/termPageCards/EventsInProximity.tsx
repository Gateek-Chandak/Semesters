import { CalendarEvent } from "@/types/mainTypes";
import { Card } from "../ui/card";
import { format } from "date-fns";

interface EventsInProximityProps {
    proximityInDays: number;
    calendarEvents: CalendarEvent[]
}

const EventsInProximity: React.FC<EventsInProximityProps> = ( {proximityInDays, calendarEvents}: EventsInProximityProps ) => {

    const now = new Date();
    const proximityDaysFromNow = new Date();
    proximityDaysFromNow.setDate(now.getDate() + proximityInDays);

    const eventsNextXDays = calendarEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= now && eventDate <= proximityDaysFromNow;
    });

    return ( 
        <Card className="w-[100%] h-full h-max-[27rem] overflow-y-auto p-4 flex flex-col gap-2">
            <div className="h-full flex flex-col gap-4 justify-between">
                {eventsNextXDays.length > 0 && eventsNextXDays.map((event) => {
                    return (
                        <Card key={event.id} className={`p-5 h-full bg-gradient-to-b from-${event.color}-100 via-${event.color}-100 to-white`}>
                            <h1 className={`font-medium text-${event.color}-600`}>{event.course}</h1>
                            <div className="mt-2 flex flex-row justify-between">
                                <p className="font-normal">{event.title}</p>
                                <p className="font-extralight text-sm">{format(event.start, `MMMM dd, yyyy '@' hh:mma`)}</p>
                            </div>
                        </Card>
                    )
                })} 
                {eventsNextXDays.length <= 0 && 
                    <div className="w-full h-full flex flex-row justify-center items-center">
                        <h1 className="font-medium">No Upcoming Deliverables.</h1>
                    </div>
                }
            </div>
        </Card>
     );
}
 
export default EventsInProximity;