import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { UserProfile } from "@/lib/types";
import { getFormattedDate } from "@/lib/utils";

interface ProfileOverviewProps {
  profile: UserProfile;
  onEditProfile: () => void;
}

export default function ProfileOverview({ profile, onEditProfile }: ProfileOverviewProps) {
  return (
    <Card className="bg-background-surface rounded-xl border border-accent/20 overflow-hidden card-glow mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 flex items-start justify-center mb-6 md:mb-0">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl bg-accent-alt text-white">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="md:ml-8 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-muted-foreground mt-1">{profile.email}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-background"
                  onClick={onEditProfile}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mt-6">
              <div>
                <div className="text-muted-foreground text-sm">Member Since</div>
                <div className="font-medium mt-1">{getFormattedDate(profile.memberSince)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Subscription</div>
                <div className="font-medium mt-1">{profile.subscription}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">API Usage</div>
                <div className="font-medium mt-1">{profile.apiUsage.used} / {profile.apiUsage.limit} calls</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
