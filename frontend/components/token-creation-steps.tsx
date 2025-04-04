import { Wallet, FileText, Rocket } from "lucide-react"

export default function TokenCreationSteps() {
  const steps = [
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Connect Wallet",
      description: "Connect your cryptocurrency wallet to our platform securely.",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Configure Token",
      description: "Set your token name, symbol, supply, and other parameters.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: "Launch Token",
      description: "Deploy your token to the blockchain with one click.",
    },
  ]

  return (
    <div className="grid gap-8 mt-12 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">{step.icon}</div>
            <div className="absolute top-0 right-0 -mr-2 -mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">
              {index + 1}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>

          {index < steps.length - 1 && (
            <div className="hidden md:block h-0.5 w-full max-w-[100px] bg-border absolute left-[calc(50%+6rem)] top-[4.5rem]" />
          )}
        </div>
      ))}
    </div>
  )
}

