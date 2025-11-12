import daoLogo from "@/assets/dao-logo.png";

export const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        <img
          src={daoLogo}
          alt="DAO Brussels"
          className="h-32 w-32 object-contain relative z-10"
        />
      </div>
      <div className="space-y-4 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Support the Brussels Crypto Community
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Deposit your Bitcoin. Keep ownership. Fund your community.
        </p>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto italic">
          "The safest place to store your Bitcoin is your community."
        </p>
      </div>
    </div>
  );
};
