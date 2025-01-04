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
    const circumference = 2 * Math.PI * 65
    const strokeDasharray = circumference
    let strokeDashoffset = circumference - (percentage / 100) * circumference
    if (percentage >= 100) {
      strokeDashoffset = circumference - (100 / 100) * circumference
    } 
  
    return (
<div className="flex flex-col relative top-0 items-center justify-center text-center gap-2">
  {/* Circle Graph */}
  <div className="relative left-2">
    <svg className="w-40 h-40 transform -rotate-90">
      {/* Background Circle */}
      <circle
        cx="70"
        cy="70"
        r="65"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        className="text-muted/20"
      />
      {/* Progress Circle */}
      <circle
        cx="70"
        cy="70"
        r="65"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        style={{
          strokeDasharray,
          strokeDashoffset: isShowingAverage ? strokeDashoffset : 0,
        }}
        className="text-primary transition-all duration-1000 ease-out"
      />
    </svg>
    {/* Percentage Label */}
    <div className="absolute inset-0 flex items-center justify-center">
      {isShowingAverage ? (
        <span className="text-3xl font-bold text-black relative right-2 top-3">
          {parseFloat(percentage.toFixed(2))}%
        </span>
      ) : (
        <span className="text-5xl font-bold text-black relative right-2 top-3">--</span>
      )}
    </div>
  </div>

  {/* Separator */}
  <Separator className="w-[95%]" />

  {/* Toggle Button */}
  <div className="flex justify-center items-center gap-4">
    <Button onClick={() => setIsShowingAverage(!isShowingAverage)} variant="ghost">
      {isShowingAverage ? (
        <EyeOffIcon className="!w-6 !h-6" />
      ) : (
        <EyeIcon className="!w-6 !h-6" />
      )}
    </Button>
  </div>
</div>

    )
  }
  