import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  Brain,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  BookOpen
} from "lucide-react";

interface LearningMetrics {
  overallScore: number;
  weeklyProgress: number;
  completedActivities: number;
  totalActivities: number;
  learningStreak: number;
  timeSpent: number; // in minutes
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface ProgressAnalyticsProps {
  userId: string;
  courseId?: string;
  metrics?: LearningMetrics;
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ 
  userId, 
  courseId,
  metrics = {
    overallScore: 78,
    weeklyProgress: 15,
    completedActivities: 12,
    totalActivities: 18,
    learningStreak: 7,
    timeSpent: 240,
    strengths: [
      "Component Architecture",
      "State Management", 
      "React Hooks",
      "Props Patterns"
    ],
    weaknesses: [
      "Performance Optimization",
      "Testing Strategies",
      "Advanced Patterns",
      "Error Boundaries"
    ],
    recommendations: [
      "Focus on React.memo and useMemo optimization techniques",
      "Practice writing unit tests for custom hooks",
      "Study compound component patterns for better API design",
      "Learn error boundary implementation for production apps"
    ]
  }
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Learning Analytics
          </CardTitle>
          <CardDescription>
            AI-powered insights from your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className={`text-2xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                {metrics.overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <Badge variant={getScoreBadgeVariant(metrics.overallScore)} className="mt-1">
                {metrics.overallScore >= 80 ? 'Excellent' : metrics.overallScore >= 60 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
            
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.learningStreak}
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
              <div className="flex justify-center mt-1">
                <Award className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
            
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.completedActivities}/{metrics.totalActivities}
              </div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <Progress 
                value={(metrics.completedActivities / metrics.totalActivities) * 100} 
                className="mt-2 h-2"
              />
            </div>
            
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {formatTime(metrics.timeSpent)}
              </div>
              <p className="text-sm text-muted-foreground">Time Spent</p>
              <div className="flex justify-center mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Your Strengths
            </CardTitle>
            <CardDescription>
              Areas where you excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{strength}</span>
                  <Badge variant="outline" className="ml-auto text-xs text-green-600">
                    Strong
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              Growth Areas
            </CardTitle>
            <CardDescription>
              Focus areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <Target className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{weakness}</span>
                  <Badge variant="outline" className="ml-auto text-xs text-orange-600">
                    Focus
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on your learning patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">{recommendation}</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Learn More
                      </Button>
                      <Badge variant="secondary" className="text-xs">
                        Priority {index + 1}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Progress Trend
          </CardTitle>
          <CardDescription>
            Your learning momentum this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">This Week's Progress</span>
              <span className="text-sm text-muted-foreground">
                +{metrics.weeklyProgress}% from last week
              </span>
            </div>
            <Progress value={metrics.weeklyProgress} className="h-3" />
            
            <div className="grid grid-cols-7 gap-2 mt-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const isActive = index < 5; // Mock active days
                const score = isActive ? Math.floor(Math.random() * 40) + 60 : 0;
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{day}</div>
                    <div 
                      className={`h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                        isActive 
                          ? score >= 80 
                            ? 'bg-green-500 text-white' 
                            : score >= 60 
                            ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      {isActive ? `${score}%` : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;