import { useEffect, useState } from "react"

interface CircularProgressProps {
    percentage: number
    label: string
    description: string
  }
  
  export function CircularProgress({ percentage, label, description }: CircularProgressProps) {
    const circumference = 2 * Math.PI * 70
    const strokeDasharray = circumference
    let strokeDashoffset = circumference - (percentage / 100) * circumference
    if (percentage >= 100) {
      strokeDashoffset = circumference - (100 / 100) * circumference
    } 

    const [strokeColour, setStrokeColour] = useState<string>('currentColor')

    useEffect(() => {
      if (percentage == 0) {
        setStrokeColour('currentColor')
      } else if (percentage < 50) {
        setStrokeColour('red')
      } else if (percentage >= 50 && percentage < 65) {
        setStrokeColour('orange')
      } else if (percentage >= 65) {
        setStrokeColour('green')
      }
    }, [percentage])
  
    return (
      <div className="flex flex-col items-center text-center p-4 gap-2">
        <h3 className="text-xl font-medium">{label}</h3>
        <div className="relative inline-flex items-center justify-center">
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
          </svg>
          <span className="absolute text-4xl font-bold" style={{color: strokeColour}}>{percentage}%</span>
        </div>
        {/* <p className="text-sm font-light">{description}</p> */}

      </div>
    )
  }
  