import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Users, GraduationCap } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Commons Hub Brussels",
    description: "Community space for crypto citizens to work, meet, and build together",
    icon: Building2,
  },
  {
    id: 2,
    name: "Crypto Wednesday",
    description: "Monthly meetups with presentations, discussions, and networking",
    icon: Calendar,
  },
  {
    id: 3,
    name: "Block 26",
    description: "Brussels Blockchain Week events and conferences",
    icon: Users,
  },
  {
    id: 4,
    name: "Education Programs",
    description: "Workshops and training sessions for crypto newcomers",
    icon: GraduationCap,
  },
];

export const SupportedProjects = () => {
  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Supported Projects</h2>
        <p className="text-muted-foreground">
          Community initiatives funded by BXL Vault yield
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <Card key={project.id} className="hover-scale">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
