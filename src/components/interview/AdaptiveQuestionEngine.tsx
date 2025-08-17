import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, TrendingUp, Target, Zap, Brain, Users } from 'lucide-react';

interface QuestionAnalytics {
  difficulty_adaptation: number;
  performance_trend: 'improving' | 'declining' | 'stable';
  suggested_topics: string[];
  next_question_preview: string;
  ai_confidence: number;
}

interface AdaptiveQuestionEngineProps {
  analytics: QuestionAnalytics;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  questionsAnswered: number;
  totalQuestions: number;
}

const AdaptiveQuestionEngine: React.FC<AdaptiveQuestionEngineProps> = ({
  analytics,
  currentDifficulty,
  questionsAnswered,
  totalQuestions
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'stable': return <Target className="h-4 w-4 text-blue-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Question Engine
          <Badge variant="outline" className="ml-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1" />
            Adapting
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress & Current Difficulty */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Interview Progress</span>
            <span className="text-sm text-muted-foreground">{questionsAnswered}/{totalQuestions}</span>
          </div>
          <Progress value={(questionsAnswered / totalQuestions) * 100} className="h-2" />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium">Current Difficulty</span>
            <Badge className={getDifficultyColor(currentDifficulty)}>
              {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {getTrendIcon(analytics.performance_trend)}
            <span className="text-sm font-semibold">Performance Trend</span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            Your performance is currently {analytics.performance_trend}
          </p>
        </div>

        {/* AI Adaptation Level */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">AI Adaptation Level</span>
          </div>
          <Progress value={analytics.difficulty_adaptation} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Questions are being adapted based on your performance patterns
          </p>
        </div>

        {/* Suggested Focus Areas */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="text-sm font-semibold">Focus Areas Detected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analytics.suggested_topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Next Question Preview */}
        <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">Next Question Preview</span>
          </div>
          <p className="text-xs text-blue-700">
            "{analytics.next_question_preview}"
          </p>
        </div>

        {/* AI Confidence */}
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">AI Confidence</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {analytics.ai_confidence}%
          </div>
          <Progress value={analytics.ai_confidence} className="mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveQuestionEngine;