import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Target,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: string;
  currentTask?: string;
  completionRate?: number;
}

interface AgentRecommendation {
  id: string;
  agentId: string;
  type: 'course_generation' | 'study_plan' | 'weakness_remediation' | 'skill_assessment';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

interface AgentActivityPanelProps {
  userId: string;
  currentCourseId?: string;
}

const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({ userId, currentCourseId }) => {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: 'course-generation',
      name: 'Course Generator',
      status: 'active',
      lastActivity: '2 minutes ago',
      currentTask: 'Enhancing React Performance section with mind maps',
      completionRate: 85
    },
    {
      id: 'progress-analyst',
      name: 'Progress Analyst',
      status: 'processing',
      lastActivity: '30 seconds ago',
      currentTask: 'Analyzing performance patterns in React optimization',
      completionRate: 60
    },
    {
      id: 'chat-mentor',
      name: 'AI Mentor',
      status: 'active',
      lastActivity: '1 minute ago',
      currentTask: 'Providing contextual guidance on custom hooks',
      completionRate: 95
    },
    {
      id: 'interview-coach',
      name: 'Interview Coach',
      status: 'idle',
      lastActivity: '15 minutes ago',
      currentTask: 'Ready for mock interview session'
    },
    {
      id: 'resume-analyzer',
      name: 'Resume Analyzer',
      status: 'processing',
      lastActivity: '5 minutes ago',
      currentTask: 'Analyzing skills gap for React expertise',
      completionRate: 40
    },
    {
      id: 'exam-prep',
      name: 'Exam Prep Engine',
      status: 'active',
      lastActivity: '3 minutes ago',
      currentTask: 'Generating adaptive quizzes for React patterns',
      completionRate: 70
    }
  ]);

  const [recommendations, setRecommendations] = useState<AgentRecommendation[]>([
    {
      id: '1',
      agentId: 'progress-analyst',
      type: 'weakness_remediation',
      title: 'Focus on Performance Optimization Patterns',
      description: 'Your React.memo usage shows 68% accuracy. I\'ve generated targeted exercises to improve your optimization skills.',
      priority: 'high',
      estimatedTime: '45 minutes'
    },
    {
      id: '2',
      agentId: 'course-generation',
      type: 'course_generation',
      title: 'Advanced Testing Patterns Course Ready',
      description: 'Based on identified gaps, I\'ve created a comprehensive testing course with React Testing Library examples.',
      priority: 'high',
      estimatedTime: '3-4 hours'
    },
    {
      id: '3',
      agentId: 'interview-coach',
      type: 'skill_assessment',
      title: 'Mock Technical Interview Available',
      description: 'You\'re ready for a React-focused technical interview. I\'ll assess your current knowledge and provide feedback.',
      priority: 'medium',
      estimatedTime: '60 minutes'
    },
    {
      id: '4', 
      agentId: 'exam-prep',
      type: 'study_plan',
      title: 'Adaptive Quiz: Custom Hooks Mastery',
      description: 'Personalized quiz sequence to strengthen your custom hooks implementation skills.',
      priority: 'medium',
      estimatedTime: '20 minutes'
    },
    {
      id: '5',
      agentId: 'resume-analyzer',
      type: 'skill_assessment',
      title: 'Skills Gap Analysis Complete',
      description: 'Found 3 key areas to highlight for senior React positions. Review recommendations for profile optimization.',
      priority: 'low',
      estimatedTime: '15 minutes'
    }
  ]);

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'idle':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'course-generation':
        return <FileText className="h-4 w-4" />;
      case 'progress-analyst':
        return <TrendingUp className="h-4 w-4" />;
      case 'chat-mentor':
        return <MessageSquare className="h-4 w-4" />;
      case 'exam-prep':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'resume-analyzer':
        return <FileText className="h-4 w-4" />;
      case 'problem-solving':
        return <Brain className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: AgentRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
    }
  };

  const handleRecommendationAction = (recommendation: AgentRecommendation) => {
    console.log('Acting on recommendation:', recommendation);
    // Future: Trigger the appropriate agent action
  };

  return (
    <div className="space-y-6">
      {/* Agent Status Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Agent Activity
          </CardTitle>
          <CardDescription>
            Real-time status of your learning agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getAgentIcon(agent.id)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{agent.name}</span>
                      {getStatusIcon(agent.status)}
                      <Badge variant="outline" className="capitalize">
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last active: {agent.lastActivity}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {agent.currentTask && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">{agent.currentTask}</p>
                      {agent.completionRate && (
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={agent.completionRate} className="w-20" />
                          <span className="text-xs text-muted-foreground">
                            {agent.completionRate}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions from your learning agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAgentIcon(rec.agentId)}
                    <h4 className="font-medium">{rec.title}</h4>
                    <Badge variant={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {rec.estimatedTime}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {rec.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize">
                    From {rec.agentId.replace('-', ' ')} agent
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => handleRecommendationAction(rec)}
                  >
                    Act on This
                  </Button>
                </div>
              </div>
            ))}
            
            {recommendations.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No recommendations at the moment. Keep learning!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Trigger AI agents manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => console.log('Generating new course...')}
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">Generate Course</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => console.log('Analyzing progress...')}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Analyze Progress</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => console.log('Opening AI Mentor...')}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Ask AI Mentor</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => console.log('Starting mock interview...')}
            >
              <Target className="h-4 w-4" />
              <span className="text-sm">Mock Interview</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => console.log('Analyzing resume...')}
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">Resume Analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => console.log('Starting adaptive quiz...')}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Adaptive Quiz</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentActivityPanel;