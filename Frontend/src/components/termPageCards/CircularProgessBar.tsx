import { useEffect, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"

interface CircularProgressProps {
    percentage: number;
    label: string;
    description: string;
    isShowingAverage: boolean;
    setIsShowingAverage: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export function CircularProgress({ percentage, label, description, isShowingAverage, setIsShowingAverage }: CircularProgressProps) {
    const circumference = 2 * Math.PI * 70
    const strokeDasharray = circumference
    let strokeDashoffset = circumference - (percentage / 100) * circumference
    if (percentage >= 100) {
      strokeDashoffset = circumference - (100 / 100) * circumference
    } 

    const [strokeColour, setStrokeColour] = useState<string>('currentColor')

    // useEffect(() => {
    //   if (percentage == 0) {
    //     setStrokeColour('currentColor')
    //   } else if (percentage < 50) {
    //     setStrokeColour('red')
    //   } else if (percentage >= 50 && percentage < 65) {
    //     setStrokeColour('orange')
    //   } else if (percentage >= 65) {
    //     setStrokeColour('green')
    //   }
    // }, [percentage])
  
    return (
      <div className="flex flex-col items-center text-center py-4 gap-8">
        <div className="relative inline-flex items-center justify-center">
          {isShowingAverage && 
            <svg className="w-60 h-48 transform -rotate-90 ">
              <circle
                cx="120"
                cy="95"
                r="75"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="120"
                cy="95"
                r="70"
                stroke={strokeColour}
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray,
                  strokeDashoffset,
                }}
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>}
          {!isShowingAverage &&
            <svg className="w-60 h-48 transform -rotate-90 ">
              <circle
                cx="120"
                cy="95"
                r="70"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="120"
                cy="95"
                r="75"
                stroke={strokeColour}
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDashoffset,
                }}
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>}
          {isShowingAverage && <span className="absolute text-4xl font-bold" style={{color: strokeColour}}>{percentage}%</span>}
          {!isShowingAverage && <span className="absolute text-6xl font-bold" style={{color: 'black'}}>{'--'}</span>}
        </div>
        <Separator />
        <div className="flex flex-row justify-center items-center gap-8">
          <h3 className="text-sm font-medium">{label}</h3>
          <Button onClick={() => {const showing: boolean = !isShowingAverage
                                  setIsShowingAverage(!isShowingAverage)
                                  // if (showing) {
                                  //   if (percentage == 0) {
                                  //     setStrokeColour('currentColor')
                                  //   } else if (percentage < 50) {
                                  //     setStrokeColour('red')
                                  //   } else if (percentage >= 50 && percentage < 65) {
                                  //     setStrokeColour('orange')
                                  //   } else if (percentage >= 70) {
                                  //     setStrokeColour('green')
                                  //   }
                                  // } else if (!showing) {
                                  //   setStrokeColour('black')
                                  // }
                                }}
                    variant={"ghost"}>
            {isShowingAverage &&<EyeOffIcon className='!w-6 !h-6'/>}
            {!isShowingAverage &&<EyeIcon className='!w-6 !h-6'/>}
          </Button>
        </div>
        {(description !== "") && <p className="text-sm font-light">{description}</p>}
      </div>
    )
  }
  