import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, Target, TrendingUp, Users, CheckCircle2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  specialty: string;
  recommended?: boolean;
}

interface AgentSelectionPanelProps {
  onAgentSelect: (agentId: string) => void;
  selectedAgent?: string;
}

const agents: Agent[] = [
  {
    id: "interview-coach",
    name: "Interview Coach AI",
    description: "Complete interview preparation with real-time feedback on communication, body language, and technical responses.",
    icon: Bot,
    specialty: "General Interview Training",
    features: [
      "Real-time facial expression analysis",
      "Speech pattern optimization",
      "Body language coaching",
      "Confidence building exercises"
    ],
    recommended: true
  },
  {
    id: "emotional-analyzer",
    name: "Emotional Intelligence Analyzer",
    description: "Advanced emotional intelligence assessment with stress management and confidence building.",
    icon: Brain,
    specialty: "Emotional Intelligence",
    features: [
      "Stress level monitoring",
      "Confidence tracking",
      "Emotional stability analysis",
      "Personalized calming techniques"
    ]
  },
  {
    id: "adaptive-engine",
    name: "Adaptive Question Engine",
    description: "Dynamic question difficulty adjustment based on your performance and learning curve.",
    icon: Target,
    specialty: "Personalized Learning",
    features: [
      "Performance-based question selection",
      "Difficulty progression",
      "Weak area identification",
      "Custom question generation"
    ]
  },
  {
    id: "performance-tracker",
    name: "Performance Analytics Agent",
    description: "Comprehensive performance tracking with detailed analytics and improvement recommendations.",
    icon: TrendingUp,
    specialty: "Progress Monitoring",
    features: [
      "Detailed performance metrics",
      "Progress trend analysis",
      "Skill gap identification",
      "Improvement roadmap"
    ]
  },
  {
    id: "behavioral-specialist",
    name: "Behavioral Interview Specialist",
    description: "Specialized agent for behavioral questions using STAR method and situational assessments.",
    icon: Users,
    specialty: "Behavioral Assessment",
    features: [
      "STAR method coaching",
      "Situational judgment tests",
      "Leadership scenario practice",
      "Team collaboration assessment"
    ]
  }
];

const AgentSelectionPanel = ({ onAgentSelect, selectedAgent }: AgentSelectionPanelProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const handleAgentSelect = (agentId: string) => {
    onAgentSelect(agentId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Choose Your AI Interview Agent
        </h2>
        <p className="text-muted-foreground text-lg">
          Select an AI agent to guide and analyze your mock interview experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;
          const isHovered = hoveredAgent === agent.id;
          
          return (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all duration-300 relative ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'hover:shadow-lg hover:border-primary/50'
              } ${isHovered ? 'transform scale-105' : ''}`}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              onClick={() => handleAgentSelect(agent.id)}
            >
              {agent.recommended && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-white">
                  Recommended
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto mb-3 p-3 rounded-full transition-colors ${
                  isSelected ? 'bg-primary text-white' : 'bg-secondary'
                }`}>
                  <Icon size={24} />
                </div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Badge variant="outline" className="mx-auto">
                  {agent.specialty}
                </Badge>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm mb-4 min-h-[3rem]">
                  {agent.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground">Key Features:</h4>
                  <ul className="space-y-1">
                    {agent.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {agent.features.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{agent.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedAgent && (
        <div className="text-center pt-6">
          <p className="text-muted-foreground mb-4">
            Selected: <span className="font-medium text-foreground">
              {agents.find(a => a.id === selectedAgent)?.name}
            </span>
          </p>
          <Button 
            size="lg"
            onClick={() => onAgentSelect(selectedAgent)}
            className="px-8"
          >
            Continue with Selected Agent
          </Button>
        </div>
      )}
    </div>
  );
};

export default AgentSelectionPanel;