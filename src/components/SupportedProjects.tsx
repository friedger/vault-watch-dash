import { Card, CardContent } from "@/components/ui/card";
import commonsHubLogo from "@/assets/commons-hub-logo.png";
import cryptoWednesdayLogo from "@/assets/crypto-wednesday-logo.png";
import blockchainWeekLogo from "@/assets/blockchain-week-logo.png";

const projects = [
  {
    id: 1,
    name: "Commons Hub Brussels",
    description: "Community space for crypto citizens to work, meet, and build together",
    logo: commonsHubLogo,
    url: "https://commonshub.brussels/",
  },
  {
    id: 2,
    name: "Crypto Wednesday",
    description: "Monthly meetups with presentations, discussions, and networking",
    logo: cryptoWednesdayLogo,
    url: "https://dao.brussels/",
  },
  {
    id: 3,
    name: "Block 26",
    description: "Web3 New Year's Reception",
    logo: blockchainWeekLogo,
    url: "https://dao.brussels/",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          return (
            <a 
              key={project.id} 
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="hover-scale cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full overflow-hidden bg-background border">
                    <img 
                      src={project.logo} 
                      alt={`${project.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </section>
  );
};
