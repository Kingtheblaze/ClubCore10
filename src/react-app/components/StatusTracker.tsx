import { CheckCircle, Clock, Calendar, XCircle } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

type Status = "applied" | "interview" | "selected" | "rejected";

interface StatusTrackerProps {
  currentStatus: Status;
  clubName?: string;
  applicationDate?: string;
  interviewDate?: string;
  compact?: boolean;
}

const statusConfig = {
  applied: {
    label: "Applied",
    icon: Clock,
    color: "text-status-pending",
    bg: "bg-status-pending/10",
    border: "border-status-pending/30",
  },
  interview: {
    label: "Interview Scheduled",
    icon: Calendar,
    color: "text-status-interview",
    bg: "bg-status-interview/10",
    border: "border-status-interview/30",
  },
  selected: {
    label: "Selected",
    icon: CheckCircle,
    color: "text-status-selected",
    bg: "bg-status-selected/10",
    border: "border-status-selected/30",
  },
  rejected: {
    label: "Not Selected",
    icon: XCircle,
    color: "text-status-rejected",
    bg: "bg-status-rejected/10",
    border: "border-status-rejected/30",
  },
};

const statusOrder: Status[] = ["applied", "interview", "selected"];

export default function StatusTracker({
  currentStatus,
  clubName = "Tech Society",
  applicationDate = "Dec 15, 2024",
  interviewDate,
  compact = false,
}: StatusTrackerProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isRejected = currentStatus === "rejected";

  if (compact) {
    const config = statusConfig[currentStatus];
    const Icon = config.icon;
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
          config.bg,
          config.border,
          config.color
        )}
      >
        <Icon className="w-4 h-4" />
        {config.label}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg">{clubName}</h3>
          <p className="text-sm text-muted-foreground">Applied {applicationDate}</p>
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border",
            statusConfig[currentStatus].bg,
            statusConfig[currentStatus].border,
            statusConfig[currentStatus].color
          )}
        >
          {statusConfig[currentStatus].label}
        </div>
      </div>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
        <div
          className={cn(
            "absolute top-5 left-5 h-0.5 transition-all duration-500",
            isRejected ? "bg-status-rejected" : "bg-primary"
          )}
          style={{
            width: isRejected
              ? `${((currentIndex + 1) / statusOrder.length) * 100}%`
              : `${(currentIndex / (statusOrder.length - 1)) * 100}%`,
          }}
        />

        {/* Status steps */}
        <div className="relative flex justify-between">
          {statusOrder.map((status, index) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const isCompleted = currentIndex > index || (currentStatus === "selected" && index === statusOrder.length - 1);
            const isCurrent = currentIndex === index && !isRejected;
            const isPast = index < currentIndex;
            const showRejection = isRejected && index === currentIndex + 1;

            if (showRejection) {
              const rejectedConfig = statusConfig.rejected;
              const RejectedIcon = rejectedConfig.icon;
              return (
                <div key={status} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                      "bg-status-rejected/10 border-status-rejected text-status-rejected"
                    )}
                  >
                    <RejectedIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2 text-status-rejected font-medium">
                    {rejectedConfig.label}
                  </span>
                </div>
              );
            }

            return (
              <div key={status} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "bg-primary/10 border-primary text-primary",
                    !isCompleted && !isCurrent && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium",
                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {config.label}
                </span>
                {status === "interview" && interviewDate && (isPast || isCurrent) && (
                  <span className="text-xs text-muted-foreground">{interviewDate}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
